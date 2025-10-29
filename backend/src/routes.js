import express from 'express';
import { PrismaClient } from '@prisma/client';
import { issueToken, authMiddleware } from './auth.js';
import { fitsWorkingHoursForAll } from './tz.js';

const prisma = new PrismaClient();
const router = express.Router();

// Login username-only
router.post('/auth/login', async (req, res) => {
  const { username } = req.body || {};
  if (!username) return res.status(400).json({ error: 'username required' });

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(404).json({ error: 'user not found' });

  const token = issueToken({ id: user.id, username: user.username });
  res.json({ token, user });
});

router.get('/users/me', authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  res.json(user);
});

router.get('/users', authMiddleware, async (_req, res) => {
  const rows = await prisma.user.findMany({
    select: { id: true, name: true, username: true, preferredTimezone: true }
  });
  res.json(rows);
});

// Create appointment (reject jika keluar 08–17 bagi siapa pun)
router.post('/appointments', authMiddleware, async (req, res) => {
  const { title, startUtc, endUtc, inviteeIds = [] } = req.body || {};
  if (!title || !startUtc || !endUtc)
    return res.status(400).json({ error: 'title/startUtc/endUtc required' });

  const me = await prisma.user.findUnique({ where: { id: req.user.id } });
  const invitees = await prisma.user.findMany({ where: { id: { in: inviteeIds } } });
  if (invitees.length !== inviteeIds.length) {
    return res.status(400).json({ error: 'Invitee not found' });
  }

  const zones = [me.preferredTimezone, ...invitees.map(i => i.preferredTimezone)];
  const ok = fitsWorkingHoursForAll(startUtc, endUtc, zones);
  if (!ok.ok) return res.status(400).json({ error: 'timezone_conflict', detail: ok.reason });

  const created = await prisma.appointment.create({
    data: {
      title,
      creatorId: me.id,
      startUtc: new Date(startUtc),
      endUtc: new Date(endUtc),
      invitees: { create: inviteeIds.map(userId => ({ userId })) }
    },
    select: { id: true }
  });
  res.status(201).json(created);
});

// List upcoming + (optional) cancel milik sendiri
router.get('/appointments', authMiddleware, async (req, res) => {
  const now = new Date();
  const myId = req.user.id;

  const rows = await prisma.appointment.findMany({
    where: {
      endUtc: { gte: now },
      OR: [{ creatorId: myId }, { invitees: { some: { userId: myId } } }]
    },
    orderBy: { startUtc: 'asc' },
    include: { invitees: { select: { userId: true } } }
  });

  res.json(rows.map(r => ({
    id: r.id,
    title: r.title,
    creator_id: r.creatorId,
    start_utc: r.startUtc.toISOString(),
    end_utc: r.endUtc.toISOString(),
    invitee_ids: r.invitees.map(i => i.userId)
  })));
});

router.delete('/appointments/:id', authMiddleware, async (req, res) => {
  const ap = await prisma.appointment.findUnique({ where: { id: req.params.id } });
  if (!ap) return res.status(404).json({ error: 'not_found' });
  if (ap.creatorId !== req.user.id) return res.status(403).json({ error: 'forbidden' });

  await prisma.appointmentInvitee.deleteMany({ where: { appointmentId: ap.id } });
  await prisma.appointment.delete({ where: { id: ap.id } });
  res.json({ ok: true });
});

export default router;
