import { DateTime, Interval } from 'luxon';

export const WORK_START = 8;   // 08:00
export const WORK_END = 17;    // 17:00

export function fitsWorkingHoursForAll(startUtc, endUtc, zones) {
  const start = DateTime.fromISO(startUtc, { zone: 'utc' });
  const end = DateTime.fromISO(endUtc, { zone: 'utc' });
  if (!start.isValid || !end.isValid || end <= start) return { ok: false, reason: 'Invalid range' };

  for (const z of zones) {
    const sLocal = start.setZone(z);
    const eLocal = end.setZone(z);

    if (sLocal.toISODate() !== eLocal.toISODate()) {
      return { ok: false, reason: `Crosses local day in ${z}` };
    }

    const workStart = sLocal.startOf('day').plus({ hours: WORK_START });
    const workEnd = sLocal.startOf('day').plus({ hours: WORK_END });
    const workInterval = Interval.fromDateTimes(workStart, workEnd);

    if (!(workInterval.contains(sLocal) && workInterval.contains(eLocal))) {
      return { ok: false, reason: `Outside working hours in ${z} (${WORK_START}:00–${WORK_END}:00)` };
    }
  }
  return { ok: true };
}
