// The mock server's file storage. Uploaded files and their extracted text are too large for
// localStorage, so they live in IndexedDB, keyed by upload id and later by document id.
import { siteStorage } from "./siteStorage";

const DB_NAME = "rag-studio-files";
const STORE = "files";

/** `version`: the extractText version that produced `text` (missing on files stored before versions existed). */
export type StoredFile = { blob: Blob | null; text: string; version?: number };

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = siteStorage.indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const req = action(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }).finally(() => db.close()) as Promise<T>;
}

export const fileStore = {
  get: (key: string) => run<StoredFile | undefined>("readonly", (s) => s.get(key)).catch(() => undefined),
  put: (key: string, value: StoredFile) => run("readwrite", (s) => s.put(value, key)).catch(() => undefined),
  remove: (key: string) => run("readwrite", (s) => s.delete(key)).catch(() => undefined),
  /** Re-keys a stored upload to the document created from it. */
  async move(from: string, to: string) {
    const value = await fileStore.get(from);
    if (!value) return;
    await fileStore.put(to, value);
    await fileStore.remove(from);
  },
};
