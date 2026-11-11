// @ts-nocheck
// Antes dos testes: aplica as migrações e recria os dados de partida no banco local.
import path from 'path';
import { execSync } from 'child_process';
import { TEST_DATABASE_URL } from '../playwright.config';

export default function globalSetup() {
    const cwd = path.resolve(process.cwd(), '../sinaliza-backend');
    const env = { ...process.env, DATABASE_URL: TEST_DATABASE_URL };
    execSync('npx prisma migrate deploy', { cwd, env, stdio: 'pipe' });
    execSync('npx ts-node -r tsconfig-paths/register src/teste/e2e/seed.ts', { cwd, env, stdio: 'pipe' });
}
