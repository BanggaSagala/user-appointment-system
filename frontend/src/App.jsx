import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { me, getToken } from './api.js';

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) return navigate('/login');
    me().then(setUser).catch(() => navigate('/login'));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', fontFamily: 'Inter, system-ui, Arial' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>User Appointment System</h2>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/">Appointments</Link>
          <Link to="/create">Create</Link>
        </nav>
      </header>
      <hr />
      <p>Logged in as: <strong>{user?.name}</strong> ({user?.preferredTimezone})</p>
      <Outlet context={{ user }} />
    </div>
  );
}