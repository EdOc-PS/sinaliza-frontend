// @ts-nocheck
// Testes unitários do front (funções puras, sem navegador). Rodar a partir de sinaliza-frontend:
//   npx playwright test -c src/teste/playwright.unit.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './unit',
    tsconfig: './tsconfig.json',
    reporter: [['list']],
    outputDir: './resultados/unit',
});
