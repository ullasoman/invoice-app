export type ClientPayload = Record<string, any>;

const TOKEN_KEY = "auth_token";
const CLIENT_KEY = "auth_client";
const STORAGE_KEY = "auth_storage"; // "local" | "session"

const getStore = () =>
  localStorage.getItem(STORAGE_KEY) === "local" ? localStorage : sessionStorage;

export function getToken(): string | null {
  const store = getStore();
  return store.getItem(TOKEN_KEY) || null;
}

export function getClient(): ClientPayload | null {
  const store = getStore();
  const raw = store.getItem(CLIENT_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAuth(
  token: string,
  client: ClientPayload,
  remember = true
) {
  const store = remember ? localStorage : sessionStorage;

  // keep STORAGE_KEY in both so `getStore` always works
  localStorage.setItem(STORAGE_KEY, remember ? "local" : "session");
  sessionStorage.setItem(STORAGE_KEY, remember ? "local" : "session");

  store.setItem(TOKEN_KEY, token);
  store.setItem(CLIENT_KEY, JSON.stringify(client));
}

export function clearAuth() {
  [localStorage, sessionStorage].forEach((s) => {
    s.removeItem(TOKEN_KEY);
    s.removeItem(CLIENT_KEY);
    s.removeItem(STORAGE_KEY);
  });
}

export function isAuthed(): boolean {
  return !!getToken();
}
