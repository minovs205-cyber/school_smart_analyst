/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_OPENROUTER_API_KEY?: string;
  /** Ссылка Cal.com / аналог для записи на консультацию */
  readonly PUBLIC_CAL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
