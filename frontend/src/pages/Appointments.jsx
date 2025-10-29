import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { listAppointments, cancelAppointment } from '../api.js';
import AppointmentCard from '../components/AppointmentCard.jsx';

export default function Appointments() {
  const { user } = useOutletContext();
  const [items, setItems] = useState([]);
  const reload = () => listAppointments().then(setItems);

  useEffect(() => { reload(); }, []);

  const onCancel = async (id) => {
    try {
      await cancelAppointment(id);
      reload();
    } catch (e) { alert(e); }
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {items.map(a => (
        <AppointmentCard
          key={a.id}
          a={a}
          myZone={user.preferredTimezone}
          onCancel={a.creator_id === user.id ? onCancel : null}
        />
      ))}
      {items.length === 0 && <p>No upcoming appointments.</p>}
    </div>
  );
}
