/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** URL base da API. Se ausente, o client cai em http://localhost:3004. */
    readonly VITE_API_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
