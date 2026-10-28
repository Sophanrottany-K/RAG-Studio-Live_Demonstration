/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the RAG Studio backend, e.g. https://api.example.com/v1. Unset = in-browser mock. */
  readonly VITE_API_URL?: string;
}
