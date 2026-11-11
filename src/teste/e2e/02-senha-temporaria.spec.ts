// @ts-nocheck
import { test, expect, api, aviso, modal, CONTAS, criarEducador, entrarPelaTela, loginApi, tokenDe } from '../support';

const TEMPORARIA = 'Temporaria@1';
const NOVA = 'NovaSenha@2';

test.describe.configure({ mode: 'serial' });

test.describe('Primeiro acesso com senha temporária', () => {
    let email: string;
    let tokenTemporario: string;

    test.beforeAll(async ({ request }) => {
        const gestor = await tokenDe(request, CONTAS.gestor);
        ({ email } = await criarEducador(request, gestor, 'Educadora Nova', TEMPORARIA));
        tokenTemporario = await tokenDe(request, email, TEMPORARIA);
    });

    test('antes da troca, a API só libera o necessário', async ({ request }) => {
        const eu = await api(request, tokenTemporario, 'GET', 'auth/me');
        expect(eu.status).toBe(200);
        expect(eu.body.object.mustChangePassword).toBe(true);

        for (const rota of ['classrooms/mine', 'notifications', 'favorite', 'history']) {
            expect((await api(request, tokenTemporario, 'GET', rota)).status, rota).toBe(403);
        }
    });

    test('o tour não tem X nem Pular e não fecha por fora', async ({ page }) => {
        await entrarPelaTela(page, email, TEMPORARIA);
        const tour = modal(page);

        await expect(tour.getByRole('heading', { name: 'Olá, Educadora' })).toBeVisible();
        // Fora a barra de passos, o único botão é o Próximo
        await expect(tour.getByRole('button').filter({ hasNotText: /^$/ })).toHaveText(['Próximo']);
        await expect(tour.locator('button:has(svg)')).toHaveCount(0);

        await page.keyboard.press('Escape');
        await page.mouse.click(5, 5);
        await expect(tour.getByRole('heading', { name: 'Olá, Educadora' })).toBeVisible();

        // A barra de passos não deixa pular a senha
        for (const etapa of [3, 4]) {
            await tour.getByRole('button', { name: `Ir para etapa ${etapa}` }).click();
            await expect(tour.getByRole('heading', { name: /Como funciona|Como navegar/ })).toHaveCount(0);
        }

        // O menu e as telas não carregam enquanto a senha não é trocada
        await expect(page.getByRole('heading', { name: 'Minhas turmas' })).toHaveCount(0);
    });

    test('o passo da senha só libera com duas senhas iguais e válidas', async ({ page }) => {
        await entrarPelaTela(page, email, TEMPORARIA);
        const tour = modal(page);
        await tour.getByRole('button', { name: 'Próximo' }).click();

        await expect(tour.getByRole('heading', { name: 'Crie sua senha' })).toBeVisible();
        const proximo = tour.getByRole('button', { name: 'Próximo' });
        await expect(proximo).toBeDisabled();
        await expect(tour.getByRole('button', { name: 'Pular' })).toHaveCount(0);

        await page.locator('#new-password').fill('123');
        await page.locator('#confirm-password').fill('123');
        await expect(tour.getByText('A senha precisa ter pelo menos 6 caracteres.')).toBeVisible();
        await expect(proximo).toBeDisabled();

        await page.locator('#new-password').fill(NOVA);
        await page.locator('#confirm-password').fill('Diferente@3');
        await expect(tour.getByText('As senhas não coincidem.')).toBeVisible();
        await expect(proximo).toBeDisabled();

        // Recarregar não escapa do passo obrigatório
        await page.reload();
        await expect(modal(page).getByRole('heading', { name: 'Olá, Educadora' })).toBeVisible();
    });

    test('salvar a senha libera o resto do tour e a plataforma', async ({ page }) => {
        await entrarPelaTela(page, email, TEMPORARIA);
        const tour = modal(page);
        await tour.getByRole('button', { name: 'Próximo' }).click();

        await page.locator('#new-password').fill(NOVA);
        await page.locator('#confirm-password').fill(NOVA);
        await tour.getByRole('button', { name: 'Próximo' }).click();

        await expect(aviso(page, 'Senha criada com sucesso!')).toBeVisible();
        await expect(tour.getByRole('heading', { name: 'Como funciona o Sinaliza' })).toBeVisible();
        await expect(tour.getByRole('button', { name: 'Pular' })).toHaveCount(0);

        await tour.getByRole('button', { name: 'Próximo' }).click();
        await expect(tour.getByRole('heading', { name: 'Como navegar' })).toBeVisible();
        await tour.getByRole('button', { name: 'Começar' }).click();

        await expect(page.getByRole('heading', { name: 'Como navegar' })).toHaveCount(0);
        await expect(page.getByRole('heading', { name: 'Minhas turmas' })).toBeVisible();

        // Tour concluído não reabre
        await page.reload();
        await expect(page.getByRole('heading', { name: 'Minhas turmas' })).toBeVisible();
        await expect(page.getByRole('heading', { name: /Olá, Educadora/ })).toHaveCount(0);
    });

    test('a senha temporária e a sessão antiga deixam de valer', async ({ request }) => {
        expect((await loginApi(request, email, TEMPORARIA)).status).toBe(401);
        expect((await api(request, tokenTemporario, 'GET', 'auth/me')).status).toBe(401);

        const login = await loginApi(request, email, NOVA);
        expect(login.status).toBe(201);
        expect(login.body.object.user.mustChangePassword).toBe(false);
        expect((await api(request, login.body.object.access_token, 'GET', 'classrooms/mine')).status).toBe(200);
    });

    test('depois da troca, a senha só muda de novo com aprovação do gestor', async ({ request }) => {
        const token = await tokenDe(request, email, NOVA);
        const res = await api(request, token, 'PATCH', 'auth/password', { newPassword: 'OutraSenha@9' });
        expect(res.status).toBe(403);
        expect((await loginApi(request, email, NOVA)).status).toBe(201);
    });

    test('o botão de ajuda abre só a explicação, com X e Pular', async ({ page }) => {
        await entrarPelaTela(page, email, NOVA);
        await expect(page.getByRole('heading', { name: 'Minhas turmas' })).toBeVisible();

        await page.getByRole('button', { name: 'Ajuda: como usar a plataforma' }).first().click();
        const ajuda = modal(page);
        await expect(ajuda.getByRole('heading', { name: 'Como funciona o Sinaliza' })).toBeVisible();
        await expect(ajuda.getByRole('heading', { name: /Olá,/ })).toHaveCount(0);

        await ajuda.getByRole('button', { name: 'Pular' }).click();
        await expect(page.getByRole('heading', { name: 'Como funciona o Sinaliza' })).toHaveCount(0);

        await page.getByRole('button', { name: 'Ajuda: como usar a plataforma' }).first().click();
        await modal(page).getByRole('button', { name: 'Próximo' }).click();
        await expect(modal(page).getByRole('heading', { name: 'Como navegar' })).toBeVisible();
        await expect(page.locator('#new-password')).toHaveCount(0);
        await modal(page).getByRole('button', { name: 'Começar' }).click();
        await expect(page.getByRole('heading', { name: 'Como navegar' })).toHaveCount(0);
    });
});

test.describe('Regras da nova senha na API', () => {
    test('recusa senha curta, longa demais ou igual à temporária', async ({ request }) => {
        const gestor = await tokenDe(request, CONTAS.gestor);
        const { email } = await criarEducador(request, gestor, 'Regras Senha', TEMPORARIA);
        const token = await tokenDe(request, email, TEMPORARIA);

        for (const newPassword of ['12345', 'a'.repeat(65), TEMPORARIA]) {
            const res = await api(request, token, 'PATCH', 'auth/password', { newPassword });
            expect(res.status, `senha de ${newPassword.length} caracteres`).toBe(400);
        }
        expect((await loginApi(request, email, TEMPORARIA)).status).toBe(201);
    });

    test('educador não cria outro educador', async ({ request }) => {
        const professor = await tokenDe(request, CONTAS.professor);
        const res = await api(request, professor, 'POST', 'users/educator', {
            name: 'Não Autorizado',
            email: 'nao.autorizado@teste.com',
            password: TEMPORARIA,
            educatorType: 'TEACHER',
            dataProfile: {},
        });
        expect(res.status).toBe(403);
    });
});
