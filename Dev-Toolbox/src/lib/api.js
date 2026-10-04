export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8085";
const KEY = "dev_toolbox_session_id";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function getSessionId() {
    try {
        let id = localStorage.getItem(KEY);
        if (!id || !UUID_RE.test(id)) {
            id = crypto.randomUUID();
            localStorage.setItem(KEY, id);
        }
        return id;
    } catch {
        return crypto.randomUUID(); // storage blocked: session lasts until reload
    }
}

/** Switch this browser to an existing session id (restore history from another device). */
export function setSessionId(id) {
    const clean = id.trim();
    if (!UUID_RE.test(clean)) return false;
    localStorage.setItem(KEY, clean.toLowerCase());
    return true;
}

export async function api(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: { "Content-Type": "application/json", "X-Session-Id": getSessionId(), ...options.headers },
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.status === 204 ? null : res.json();
}

export const copyText = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
};

/** Backend sends LocalDateTime (no offset); the backend now runs in UTC, so read it as UTC. */
export const parseServerDate = (iso) =>
    new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(iso) ? iso : `${iso}Z`);
