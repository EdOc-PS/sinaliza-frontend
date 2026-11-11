# Testes do Sinaliza

Esta pasta não entra no Git (está em `.git/info/exclude`). Os testes do back ficam em `sinaliza-backend/src/teste`.

## Antes de rodar

1. Abra o Docker Desktop.
2. Suba o banco de testes (só na primeira vez o comando é `docker run`; depois, `docker start`):

```bash
docker start sinaliza-postgres-teste
```

O banco de testes fica na porta 5433 e é separado do banco de desenvolvimento e do Neon. Os testes se recusam a rodar em qualquer outro banco.

3. O Playwright é instalado sem alterar o `package.json`. Se um `npm install` o remover:

```bash
npm install --no-save @playwright/test
```

## Rodar

Testes end-to-end (a partir de `sinaliza-frontend`). Sobem a API e o front locais sozinhos:

```bash
npx playwright test -c src/teste/playwright.config.ts
```

Testes unitários do front (a partir de `sinaliza-frontend`):

```bash
npx playwright test -c src/teste/playwright.unit.config.ts
```

Testes unitários do back (a partir de `sinaliza-backend`):

```bash
npx jest --config src/teste/jest.config.js
```

## Resultados

- Relatório navegável: `npx playwright show-report src/teste/relatorio`
- Print, vídeo e passo a passo de cada falha: `src/teste/resultados/e2e`
- Saída da última execução: `src/teste/resultados/ultima-execucao.txt`

## Contas criadas a cada execução

Todas com a senha `Teste@123`: `gestor@teste.com`, `professor@teste.com`, `professor2@teste.com`, `aluno@teste.com`, `aluno2@teste.com`.
