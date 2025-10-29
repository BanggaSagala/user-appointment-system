import React from 'react';
import { DateTime } from 'luxon';

export default function AppointmentCard({ a, myZone, onCancel }) {
  const start = DateTime.fromISO(a.start_utc, { zone: 'utc' }).setZone(myZone).toFormat('yyyy-LL-dd HH:mm');
  const end   = DateTime.fromISO(a.end_utc,   { zone: 'utc' }).setZone(myZone).toFormat('HH:mm');
  return (
    <div style={{ border: '1px solid #eee', padding: 12, borderRadius: 8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <div>
        <strong>{a.title}</strong>
        <div>{start} – {end} ({myZone})</div>
      </div>
      {onCancel && <button onClick={()=>onCancel(a.id)}>Cancel</button>}
    </div>
  );
}
