// src/lib/api.js
// This file REPLACES src/lib/supabase.js
// All components will import from here instead of supabase

const BASE = '/api';

// Read token from localStorage (set after login)
function getToken() {
  return localStorage.getItem('auth_token');
}

// Save token after login
export function saveToken(token) {
  localStorage.setItem('auth_token', token);
}

// Remove token on logout
export function clearToken() {
  localStorage.removeItem('auth_token');
}

// ─────────────────────────────────────────
// Core fetch helpers
// ─────────────────────────────────────────

async function get(endpoint) {
  const res = await fetch(`${BASE}/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function post(endpoint, body) {
  const res = await fetch(`${BASE}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function put(endpoint, body) {
  const res = await fetch(`${BASE}/${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function del(endpoint, body) {
  const res = await fetch(`${BASE}/${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ─────────────────────────────────────────
// Public endpoints (no auth needed)
// ─────────────────────────────────────────

export const api = {
  // Auth
  login: (email, password) => post('auth-login', { email, password }),
  verifyToken: () => get('auth-verify'),

  // Public data
  getProfile: () => get('profile-get'),
  getSkills: () => get('skills-list'),
  getProjects: () => get('projects-list'),
  getSocials: () => get('social-list'),
  submitContact: (data) => post('contact-submit', data),
  getTheme: () => get('theme-get'),
  getFooter: () => get('footer-get'),

  // ─────────────────────────────────────────
  // Admin endpoints (JWT required)
  // ─────────────────────────────────────────

  // Profile
  updateProfile: (data) => put('admin-profile-update', data),

  // Skills
  adminGetSkills: () => get('admin-skills-list'),
  createSkill: (data) => post('admin-skill-create', data),
  updateSkill: (data) => put('admin-skill-update', data),
  deleteSkill: (id) => del('admin-skill-delete', { id }),

  // Projects
  adminGetProjects: () => get('admin-projects-list'),
  createProject: (data) => post('admin-project-create', data),
  updateProject: (data) => put('admin-project-update', data),
  deleteProject: (id) => del('admin-project-delete', { id }),

  // Messages
  getMessages: () => get('admin-messages-list'),
  updateMessage: (data) => put('admin-message-update', data),
  deleteMessage: (id) => del('admin-message-delete', { id }),

  // Social links
  adminGetSocials: () => get('admin-social-list'),
  createSocial: (data) => post('admin-social-create', data),
  updateSocial: (data) => put('admin-social-update', data),
  deleteSocial: (id) => del('admin-social-delete', { id }),

  // Theme
  updateTheme: (data) => put('admin-theme-update', data),

  // Footer
  adminGetFooter: () => get('admin-footer-update'),
  updateFooterSettings: (data) => put('admin-footer-update', data),
  createFooterLink: (data) => post('admin-footer-update', data),
  deleteFooterLink: (id) => del('admin-footer-update', { id }),
};
