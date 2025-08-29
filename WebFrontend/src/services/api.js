//
// Lightweight API client for the Web Frontend with env-configurable base URL,
// token handling, and simple helper methods for services exposed via the API Gateway.
//
// PUBLIC_INTERFACE
export const getApiBaseUrl = () => {
  /** Returns API base URL from environment variable. 
   * Requires: REACT_APP_API_BASE_URL in .env
   */
  const base = process.env.REACT_APP_API_BASE_URL || "";
  return base.replace(/\/+$/, "");
};

// Basic in-memory token store; persisted in localStorage for demo.
// PUBLIC_INTERFACE
export function getAuthToken() {
  /** Retrieve stored bearer token string or null. */
  try {
    return localStorage.getItem("auth_token") || null;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function setAuthToken(token) {
  /** Persist bearer token string; pass null to clear. */
  try {
    if (!token) {
      localStorage.removeItem("auth_token");
    } else {
      localStorage.setItem("auth_token", token);
    }
  } catch {
    // ignore
  }
}

async function request(path, { method = "GET", headers = {}, body, auth = false, contentType = "application/json" } = {}) {
  const base = getApiBaseUrl();
  const url = `${base}${path}`;
  const finalHeaders = { ...headers };
  if (contentType) {
    finalHeaders["Content-Type"] = contentType;
  }
  if (auth) {
    const token = getAuthToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body && contentType === "application/json" ? JSON.stringify(body) : body,
  });
  if (!res.ok) {
    let err = {};
    try {
      err = await res.json();
    } catch {
      // ignore
    }
    throw new Error(err?.detail || err?.message || `HTTP ${res.status}`);
  }
  // some endpoints may not return JSON
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return text;
  }
}

// PUBLIC_INTERFACE
export const Api = {
  /** USER SERVICE */
  // PUBLIC_INTERFACE
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  // PUBLIC_INTERFACE
  login: (email, password) =>
    request("/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username: email, password }),
      contentType: null,
    }),
  // PUBLIC_INTERFACE
  me: () => request("/users/me", { auth: true }),
  // PUBLIC_INTERFACE
  updateProfile: (payload) => request("/users/me/profile", { method: "PUT", body: payload, auth: true }),

  /** BOOKING SERVICE */
  // PUBLIC_INTERFACE
  getSeatMap: (eventId) => request(`/events/${encodeURIComponent(eventId)}/seats`),
  // PUBLIC_INTERFACE
  createReservation: (payload) => request("/reservations", { method: "POST", body: payload, auth: true }),
  // PUBLIC_INTERFACE
  createBooking: (payload) => request("/bookings", { method: "POST", body: payload, auth: true }),
  // PUBLIC_INTERFACE
  getBooking: (bookingId) => request(`/bookings/${encodeURIComponent(bookingId)}`, { auth: true }),

  /** ADMIN SERVICE */
  // PUBLIC_INTERFACE
  adminDashboardSummary: () => request("/admin/dashboard/summary", { auth: true }),
  // PUBLIC_INTERFACE
  adminUsers: () => request("/admin/users", { auth: true }),
  // PUBLIC_INTERFACE
  adminVenues: () => request("/admin/venues", { auth: true }),
  // PUBLIC_INTERFACE
  adminEvents: () => request("/admin/events", { auth: true }),
  // PUBLIC_INTERFACE
  adminAuditLogs: (limit = 50) => request(`/admin/audit/logs?limit=${limit}`, { auth: true }),

  /** VENUE SERVICE (organizer) */
  // PUBLIC_INTERFACE
  listVenues: () => request("/venues", { auth: true }),
  // PUBLIC_INTERFACE
  createVenue: (payload) => request("/venues", { method: "POST", body: payload, auth: true }),
  // PUBLIC_INTERFACE
  getVenueSeatMap: (venueId) => request(`/venues/${encodeURIComponent(venueId)}/seats/map`, { auth: true }),

  /** NOTIFICATIONS */
  // PUBLIC_INTERFACE
  listNotifications: (page = 1, size = 20) => request(`/notifications?page=${page}&size=${size}`, { auth: true }),
  // PUBLIC_INTERFACE
  sendNotification: (payload) => request("/notifications/send", { method: "POST", body: payload, auth: true }),
};

export default Api;
