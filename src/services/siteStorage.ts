// The browser storage the mock server keeps its data in (localStorage for chatbots, IndexedDB for files).
//
// Normally that is this page's own storage. The web widget is different: public/widget.js puts it in an iframe on
// the owner's website, and Chrome gives a cross-site iframe its own empty ("partitioned") storage, so it can't see
// the chatbots created in RAG Studio. `connectSiteStorage` asks Chrome for RAG Studio's real storage instead
// (Storage Access API), so a chatbot created here also works in the widget on another site in the same browser.

type StorageAccessHandle = { localStorage: Storage; indexedDB: IDBFactory };
type RequestStorageAccess = (types: { localStorage: true; indexedDB: true }) => Promise<StorageAccessHandle>;

let local: Storage | null = null;
let files: IDBFactory | null = null;

export const siteStorage = {
  get local(): Storage {
    return local ?? window.localStorage;
  },
  get indexedDB(): IDBFactory {
    return files ?? window.indexedDB;
  },
};

/** Whether this page runs inside an iframe on another site (the web widget on the owner's website). */
export function isCrossSiteFrame() {
  if (window.parent === window) return false;
  try {
    // Reading the parent's location throws when the parent is another origin.
    void window.parent.location.href;
    return false;
  } catch {
    return true;
  }
}

/**
 * Switches to RAG Studio's own (unpartitioned) storage. Resolves true when it is in use. Chrome grants it without
 * a click while third-party cookies are allowed; otherwise call it again from a click.
 */
export async function connectSiteStorage(): Promise<boolean> {
  if (local) return true;
  const request = (document as unknown as { requestStorageAccess?: RequestStorageAccess }).requestStorageAccess;
  if (!isCrossSiteFrame() || typeof request !== "function") return false;
  try {
    const handle = await request.call(document, { localStorage: true, indexedDB: true });
    local = handle.localStorage;
    files = handle.indexedDB;
    return true;
  } catch {
    return false;
  }
}
