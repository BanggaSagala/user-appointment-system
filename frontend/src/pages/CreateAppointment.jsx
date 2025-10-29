import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { createAppointment, listUsers } from '../api.js';
import { DateTime } from 'luxon';

export default function CreateAppointment() {
  const { user } = useOutletContext();
  const [title, setTitle] = useState('Sync Meeting');
  const [date, setDate] = useState(DateTime.now().toISODate());
  const [startTime, setStartTime] = useState('09:30');
  const [endTime, setEndTime] = useState('10:30');
  const [users, setUsers] = useState([]);
  const [inviteeIds, setInviteeIds] = useState([]);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  useEffect(() => { listUsers().then(setUsers); }, []);

  const toggleInvitee = (id) => setInviteeIds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');

    const startLocal = DateTime.fromISO(`${date}T${startTime}`, { zone: user.preferredTimezone });
    const endLocal   = DateTime.fromISO(`${date}T${endTime}`,   { zone: user.preferredTimezone });

    const payload = {
      title,
      startUtc: startLocal.toUTC().toISO(),
      endUtc: endLocal.toUTC().toISO(),
      inviteeIds
    };

    try {
      await createAppointment(payload);
      navigate('/');
    } catch (e) { setErr(String(e)); }
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      <label>Title<input value={title} onChange={e=>setTitle(e.target.value)} style={{ width:'100%', padding:8 }} /></label>
      <label>Date<input type="date" value={date} onChange={e=>setDate(e.target.value)} /></label>
      <div style={{ display: 'flex', gap: 12 }}>
        <label>Start<input type="time" value={startTime} onChange={e=>setStartTime(e.target.value)} /></label>
        <label>End<input type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} /></label>
      </div>
      <fieldset style={{ border: '1px solid #eee', padding: 8 }}>
        <legend>Invitees</legend>
        {users.filter(u=>u.id!==user.id).map(u => (
          <label key={u.id} style={{ display: 'block' }}>
            <input type="checkbox" checked={inviteeIds.includes(u.id)} onChange={()=>toggleInvitee(u.id)} />
            {u.name} ({u.preferredTimezone})
          </label>
        ))}
      </fieldset>
      <button type="submit">Create</button>
      {err && <p style={{ color: 'crimson' }}>{err}</p>}
    </form>
  );
}
