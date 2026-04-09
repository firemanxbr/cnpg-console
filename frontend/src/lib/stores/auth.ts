import { writable } from 'svelte/store';
export const auth = writable<{ authenticated: boolean; user: { name: string; email: string } | null; token: string | null }>({ authenticated: false, user: null, token: null });
export function login(token: string, p: any) { sessionStorage.setItem('access_token', token); auth.set({ authenticated: true, user: { name: p.name || p.email, email: p.email || '' }, token }); }
export function logout() { sessionStorage.removeItem('access_token'); auth.set({ authenticated: false, user: null, token: null }); }
export function restoreSession() { const t = sessionStorage.getItem('access_token'); if (!t) return; try { const p = JSON.parse(atob(t.split('.')[1])); if (p.exp * 1000 > Date.now()) login(t, p); else logout(); } catch { logout(); } }
