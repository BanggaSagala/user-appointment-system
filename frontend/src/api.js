const API = 'http://127.0.0.1:4000/api';

export async function login(username) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export function setToken(t) { localStorage.setItem('token', t); }
export function getToken() { return localStorage.getItem('token'); }

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function me() {
  const res = await fetch(`${API}/users/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Auth');
  return res.json();
}

export async function listUsers() {
  const res = await fetch(`${API}/users`, { headers: authHeaders() });
  return res.json();
}

export async function listAppointments() {
  const res = await fetch(`${API}/appointments`, { headers: authHeaders() });
  return res.json();
}

export async function createAppointment(payload) {
  const res = await fetch(`${API}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || data?.error || 'Create failed');
  return data;
}

export async function cancelAppointment(id) {
  const res = await fetch(`${API}/appointments/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error('Cancel failed');
  return res.json();
}
