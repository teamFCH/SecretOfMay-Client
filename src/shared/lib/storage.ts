type StorageKind = "local" | "session";

function resolveStorage(kind: StorageKind): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function readStorageItem(kind: StorageKind, key: string) {
  const storage = resolveStorage(kind);

  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorageItem(kind: StorageKind, key: string, value: string) {
  const storage = resolveStorage(kind);

  if (!storage) {
    return false;
  }

  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeStorageItem(kind: StorageKind, key: string) {
  const storage = resolveStorage(kind);

  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function readJsonStorage<T>(
  kind: StorageKind,
  key: string,
  validate: (value: unknown) => value is T,
) {
  const raw = readStorageItem(kind, key);

  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return validate(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
