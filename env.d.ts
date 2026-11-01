/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly ISCORD_WEBHOOK_URL?: string
  readonly DISCORD_WEBHOOK_URL?: string
  readonly VITE_ISCORD_WEBHOOK_URL?: string
  readonly VITE_DISCORD_WEBHOOK_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
