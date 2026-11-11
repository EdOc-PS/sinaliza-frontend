// @ts-nocheck
import { test, expect, api, aviso, modal, CONTAS, SENHA, abrirComo, criarEducadorPronto, entrarPelaTela, loginApi, tokenDe } from '../support';

const NOVA = 'Aprovada@77';

test.describe.configure({ mode: 'serial' });

test.describe('Pedido de nova senha', () => {
    let email: string;
    let nome: string;
    let token: string;
    let gestor: string;

    const pedidosDoGestor = async (request) => {
        const res = await api(request, gestor, 'GET', 'notifications');
        return res.body.object.filter((n) => n.passwordRequest && n.message.includes(nome));
    };

    test.beforeAll(async ({ request }) => {
        gestor = await tokenDe(request, CONTAS.gestor);
        nome = `Pedido Senha ${Date.now()}`;
        ({ email, token } = await criarEducadorPronto(request, gestor, nome));
    });

    test('o perfil envia o pedido uma única vez', async ({ page }) => {
        await abrirComo(page, page.request, email, '/profile');
        const botao = page.getByRole('button', { name: 'Solicitar nova senha' });

        await botao.click();
        await expect(aviso(page, /Pedido enviado ao gestor/)).toBeVisible();

        await botao.click();
        await expect(aviso(page, /já tem um pedido/)).toBeVisible();

        expect(await pedidosDoGestor(page.request)).toHaveLength(1);
    });

    test('pedir não libera a troca, e quem pediu não decide', async ({ request }) => {
        expect((await api(request, token, 'PATCH', 'auth/password', { newPassword: NOVA })).status).toBe(403);

        const [pedido] = await pedidosDoGestor(request);
        const res = await api(request, token, 'PATCH', `notifications/password-requests/${pedido.passwordRequest.id}`, { approve: true });
        expect(res.status).toBe(403);
    });

    test('o sino do gestor mostra que há aviso novo', async ({ page }) => {
        await abrirComo(page, page.request, CONTAS.gestor, '/classrooms');
        await expect(page.getByRole('button', { name: /Notificações: \d+ não lidas/ }).first()).toBeVisible();
    });

    test('o gestor aprova pela tela de notificações', async ({ page }) => {
        await abrirComo(page, page.request, CONTAS.gestor, '/notifications');
        await expect(page.getByRole('heading', { name: 'Notificações' })).toBeVisible();

        const item = page.getByRole('listitem').filter({ hasText: nome });
        await expect(item.getByText('Pedido de troca de senha')).toBeVisible();
        await item.getByRole('button', { name: 'Aprovar' }).click();

        await expect(aviso(page, 'Pedido aprovado')).toBeVisible();
        await expect(item.getByText('Pedido aprovado')).toBeVisible();
        await expect(item.getByRole('button', { name: 'Aprovar' })).toHaveCount(0);

        // Depois de abrir a tela, o sino volta ao estado sem aviso novo
        await page.goto('/classrooms');
        await expect(page.getByRole('button', { name: 'Notificações', exact: true }).first()).toBeVisible();
    });

    test('pedido já decidido não pode ser decidido de novo', async ({ request }) => {
        const [pedido] = await pedidosDoGestor(request);
        expect(pedido.passwordRequest.status).toBe('APPROVED');
        const res = await api(request, gestor, 'PATCH', `notifications/password-requests/${pedido.passwordRequest.id}`, { approve: false });
        expect(res.status).toBe(409);
    });

    test('a sessão antiga não troca a senha: é preciso entrar de novo', async ({ request }) => {
        expect((await api(request, token, 'PATCH', 'auth/password', { newPassword: NOVA })).status).toBe(403);
    });

    test('no próximo login abre só o passo da nova senha', async ({ page }) => {
        await entrarPelaTela(page, email);
        const troca = modal(page);

        await expect(troca.getByRole('heading', { name: 'Crie sua senha' })).toBeVisible();
        await expect(page.getByRole('heading', { name: /Olá,/ })).toHaveCount(0);
        await expect(troca.getByRole('button', { name: 'Pular' })).toHaveCount(0);
        await expect(page.getByRole('heading', { name: 'Minhas turmas' })).toHaveCount(0);

        await page.locator('#new-password').fill(NOVA);
        await page.locator('#confirm-password').fill(NOVA);
        await troca.getByRole('button', { name: /Próximo|Começar/ }).click();

        await expect(aviso(page, 'Senha criada com sucesso!')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Crie sua senha' })).toHaveCount(0);
        await expect(page.getByRole('heading', { name: 'Minhas turmas' })).toBeVisible();
    });

    test('a senha antiga deixa de valer e quem pediu é avisado', async ({ request }) => {
        expect((await loginApi(request, email, SENHA)).status).toBe(401);
        const novo = await tokenDe(request, email, NOVA);
        const avisos = await api(request, novo, 'GET', 'notifications');
        expect(avisos.body.object.some((n) => n.title === 'Troca de senha aprovada')).toBe(true);
    });

    test('pedido recusado não libera a troca', async ({ page }) => {
        const novo = await tokenDe(page.request, email, NOVA);
        expect((await api(page.request, novo, 'POST', 'notifications/password-requests')).status).toBe(201);

        await abrirComo(page, page.request, CONTAS.gestor, '/notifications');
        const item = page.getByRole('listitem').filter({ hasText: nome }).filter({ has: page.getByRole('button', { name: 'Recusar' }) });
        await item.getByRole('button', { name: 'Recusar' }).click();
        await expect(aviso(page, 'Pedido recusado')).toBeVisible();

        const login = await loginApi(page.request, email, NOVA);
        expect(login.body.object.user.mustChangePassword).toBe(false);
        const avisos = await api(page.request, login.body.object.access_token, 'GET', 'notifications');
        expect(avisos.body.object.some((n) => n.title === 'Troca de senha recusada')).toBe(true);
    });
});

test.describe('Notificações: cada um só mexe nas suas', () => {
    test('um usuário não apaga a notificação de outro', async ({ request }) => {
        const gestor = await tokenDe(request, CONTAS.gestor);
        const professor = await tokenDe(request, CONTAS.professor);
        const doGestor = (await api(request, gestor, 'GET', 'notifications')).body.object;
        expect(doGestor.length).toBeGreaterThan(0);

        await api(request, professor, 'DELETE', `notifications/${doGestor[0].id}`);
        const depois = (await api(request, gestor, 'GET', 'notifications')).body.object;
        expect(depois.map((n) => n.id)).toContain(doGestor[0].id);
    });

    test('apagar uma e apagar todas pela tela', async ({ page }) => {
        const gestor = await tokenDe(page.request, CONTAS.gestor);
        const antes = (await api(page.request, gestor, 'GET', 'notifications')).body.object.length;
        expect(antes).toBeGreaterThan(1);

        await abrirComo(page, page.request, CONTAS.gestor, '/notifications');
        await page.getByRole('button', { name: /^Apagar notificação:/ }).first().click();
        await expect(page.getByRole('listitem')).toHaveCount(antes - 1);

        await page.getByRole('button', { name: 'Apagar todas' }).click();
        await expect(page.getByText('Você não tem notificações.')).toBeVisible();
        expect((await api(page.request, gestor, 'GET', 'notifications')).body.object).toHaveLength(0);
    });
});
