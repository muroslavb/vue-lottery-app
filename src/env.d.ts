/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Базова адреса REST API, задається у файлі .env */
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
