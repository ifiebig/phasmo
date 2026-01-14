const KEY = "phasmoprofi_override_v1";

export function loadOverride() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveOverride(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clearOverride() {
  localStorage.removeItem(KEY);
}
