import React, { useState } from 'react';
import { login, setToken } from '../api.js';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('bangga');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await login(username);
      setToken(token);
      navigate('/');
    } catch (e) { setErr(String(e)); }
  };

  return (
    <div style={{ maxWidth: 360, margin: '120px auto', fontFamily: 'Inter, system-ui, Arial' }}>
      <h3>Login</h3>
      <form onSubmit={onSubmit}>
        <label>Username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 6, marginBottom: 12 }} />
        <button type="submit">Sign in</button>
      </form>
      {err && <p style={{ color: 'crimson' }}>{err}</p>}
      <p style={{ fontSize: 12, color: '#666' }}>Use seeded users: bangga, alya, rafi</p>
    </div>
  );
}
