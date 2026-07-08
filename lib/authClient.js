const AUTH_STORAGE_KEY = 'music_graciously_auth';

export const AUTH_API_BASE_URL = (
  process.env.NEXT_PUBLIC_AUTH_API_BASE_URL ||
  process.env.NEXT_PUBLIC_CHECKOUT_API_BASE_URL ||
  'http://localhost:8000'
).replace(/\/$/, '');

export function readAuthState() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
}

export function writeAuthState(state) {
  if (typeof window === 'undefined') return;
  if (!state) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
}

export function clearAuthState() {
  writeAuthState(null);
}

export async function authRequest(path, { method = 'POST', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${AUTH_API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = text ? { detail: text } : null;
  }

  if (!response.ok) {
    const message = data?.detail || data?.message || 'Authentication request failed.';
    throw new Error(Array.isArray(message) ? message.map((item) => item.msg || String(item)).join(', ') : message);
  }

  return data;
}

export async function registerAccount(payload) {
  return authRequest('/api/auth/register', { body: payload });
}

export async function loginAccount(payload) {
  return authRequest('/api/auth/login', { body: payload });
}

export async function verifyEmail(payload) {
  return authRequest('/api/auth/verify-email', { body: payload });
}

export async function verifyLogin(payload) {
  return authRequest('/api/auth/verify-login', { body: payload });
}

export async function forgotPassword(payload) {
  return authRequest('/api/auth/forgot-password', { body: payload });
}

export async function resetPassword(payload) {
  return authRequest('/api/auth/reset-password', { body: payload });
}

export async function fetchCurrentUser(accessToken) {
  return authRequest('/api/auth/me', { method: 'GET', token: accessToken });
}

export async function logoutAccount(refreshToken) {
  if (!refreshToken) return { ok: true };
  return authRequest('/api/auth/logout', { body: { refreshToken } });
}

export function persistAuthResponse(response) {
  const nextState = {
    user: response.user,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    tokenType: response.tokenType || 'bearer',
    expiresIn: response.expiresIn || null,
    savedAt: Date.now(),
  };
  writeAuthState(nextState);
  return nextState;
}
