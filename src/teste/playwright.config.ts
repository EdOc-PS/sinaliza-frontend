// @ts-nocheck
// Testes end-to-end. Rodar a partir de sinaliza-frontend:
//   npx playwright test -c src/teste/playwright.config.ts
// Sobe a API e o front locais, sempre contra o banco local de testes (porta 5433).
import path from 'path';
import { defineConfig, devices } from '@playwright/test';

const FRONT = process.cwd();
const BACK = path.resolve(FRONT, '../sinaliza-backend');

export const TEST_DATABASE_URL = 'postgresql://postgres:postgres@localhost:5433/sinaliza_teste';
export const API_URL = 'http://localhost:3004';
export const APP_URL = 'http://localhost:5173';

export const BACK_ENV = {
    DATABASE_URL: TEST_DATABASE_URL,
    PORT: '3004',
    JWT_SECRET: 'segredo-somente-para-testes',
    CORS_ORIGIN: APP_URL,
    FRONTEND_URL: APP_URL,
    // Nenhum email sai durante os testes
    RESEND_API_KEY: '',
    EMAIL_NOTIFICATIONS_ENABLED: 'false',
};

export default defineConfig({
    testDir: './e2e',
    tsconfig: './tsconfig.json',
    globalSetup: './support/global-setup.ts',
    // Os testes compartilham o mesmo banco: um de cada vez
    workers: 1,
    fullyParallel: false,
    timeout: 45_000,
    expect: { timeout: 8_000 },
    reporter: [['list'], ['html', { open: 'never', outputFolder: './relatorio' }]],
    outputDir: './resultados/e2e',
    use: {
        ...devices['Desktop Chrome'],
        baseURL: APP_URL,
        locale: 'pt-BR',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    webServer: [
        {
            command: 'npx ts-node -r tsconfig-paths/register src/teste/e2e/server.ts',
            cwd: BACK,
            env: BACK_ENV,
            url: `${API_URL}/health`,
            reuseExistingServer: false,
            timeout: 180_000,
        },
        {
            // O .env do front aponta para a API de produção: aqui ela é trocada pela local
            // Versão compilada, igual à publicada: mais estável que o modo de desenvolvimento
            command: 'npx vite build && npx vite preview --port 5173 --strictPort',
            cwd: FRONT,
            env: { VITE_API_URL: API_URL },
            url: APP_URL,
            reuseExistingServer: false,
            timeout: 240_000,
        },
    ],
});
