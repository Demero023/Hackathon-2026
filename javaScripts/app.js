"use strict";

/* ---------- Storage keys ---------- */

// One place to define every localStorage key.
// All three follow the same naming pattern so there is no
// confusion later about "was it mojela_users or mojelas_users?"
const KEYS = {
  users: "mojelas_users",
  requests: "mojelas_requests",
  session: "mojelas_session",
};

/* ---------- Read / write localStorage ---------- */

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------- Users ---------- */

/** Return the array of all registered users. Empty array on first run. */
function getUsers() {
  return load(KEYS.users, []);
}

/** Save the full users array back to localStorage. */
function saveUsers(users) {
  save(KEYS.users, users);
}

/** Find one user by id. Returns undefined if nobody matches. */
function findUserById(id) {
  return getUsers().find((user) => user.id === id);
}

/* ---------- Requests ---------- */

/** Return the array of all care requests. Empty array on first run. */
function getRequests() {
  return load(KEYS.requests, []);
}

/** Save the full requests array back to localStorage. */
function saveRequests(requests) {
  save(KEYS.requests, requests);
}

/* ---------- Session ---------- */

/**
 * Return the currently logged-in user, or null.
 * Reads the session id from localStorage and looks up the user.
 */
function currentUser() {
  const id = localStorage.getItem(KEYS.session);
  if (id === null) return null;
  return findUserById(id) || null;
}

/**
 * Store the user's id as the active session.
 * This is the entire "login" — no tokens, no cookies, just an id.
 */
function loginAs(user) {
  localStorage.setItem(KEYS.session, user.id);
}

/** Remove the session. Next page load, currentUser() returns null. */
function logout() {
  localStorage.removeItem(KEYS.session);
}

/* ---------- Routing ---------- */

/**
 * Which page a user should land on after logging in or registering.
 * Explicit checks — if a role is missing or unexpected, go home
 * rather than silently show the wrong dashboard.
 */
function homePageFor(user) {
  if (user.role === "caregiver") return "caregiver.html";
  if (user.role === "parent") return "mother.html";
  return "index.html";
}
