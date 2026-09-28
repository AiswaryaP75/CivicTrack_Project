// Base URL of the backend. During development this points at the
// Express server from `auth_backend` running on port 5000.
// Change this if you deploy the backend elsewhere.
const API_BASE = "http://localhost:5000/api";

/**
 * apiRequest
 * Thin wrapper around fetch that:
 *  - prefixes the backend base URL
 *  - attaches the JWT (if present) as a Bearer token
 *  - always sends/expects JSON
 *  - throws a normal Error with the backend's message on failure,
 *    so callers can just try/catch and show err.message
 */
export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new Error(
      "Could not reach the backend. Is the server running on http://localhost:5000?"
    );
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}

export const authApi = {
  register: (payload) => apiRequest("/auth/register", { method: "POST", body: payload }),
  login: (payload) => apiRequest("/auth/login", { method: "POST", body: payload }),
  me: (token) => apiRequest("/auth/me", { token }),
  updatePassword: (payload, token) =>
    apiRequest("/auth/update-password", { method: "PUT", body: payload, token }),
  registerStaff: (payload, token) =>
    apiRequest("/auth/register-staff", { method: "POST", body: payload, token }),
};
