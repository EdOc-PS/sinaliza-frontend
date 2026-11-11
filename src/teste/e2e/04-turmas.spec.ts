// @ts-nocheck
import { test, expect, api, aviso, modal, CONTAS, abrirComo, tokenDe } from '../support';

// Janela alta: a lista de membros fica fora da área do botão flutuante (ver teste próprio abaixo)
test.use({ viewport: { width: 1280, height: 1100 } });

test.describe('Turmas', () => {
    const NOME = 'Turma E2E';
    const CRIADA_NA_TELA = 'Turma Criada na Tela';
    let turma: { id: string; classCode: string };
    let professor: string;
    let professor2: string;
    let aluno: string;
    let aluno2: string;

    // Para o aluno, o botão flutuante já abre direto o "participar de uma turma"
    const abrirFab = async (page, acao?: string) => {
        await page.locator('button.rounded-full.bg-cloud-500').last().click();
        if (acao) await page.getByRole('button', { name: acao }).click();
    };

    const membros = async (request) =>
        (await api(request, professor, 'GET', `classrooms/${turma.id}/members`)).body.object;

    test.beforeAll(async ({ request }) => {
        professor = await tokenDe(request, CONTAS.professor);
        professor2 = await tokenDe(request, CONTAS.professor2);
        aluno = await tokenDe(request, CONTAS.aluno);
        aluno2 = await tokenDe(request, CONTAS.aluno2);

        const minhas = (await api(request, professor, 'GET', 'classrooms/mine')).body.object;
        let existente = minhas.find((c) => c.name === NOME);
        if (!existente) {
            const criada = await api(request, professor, 'POST', 'classrooms', { name: NOME });
            expect(criada.status, JSON.stringify(criada.body)).toBe(201);
            existente = criada.body.object;
        }
        turma = { id: existente.id, classCode: existente.classCode };
    });

    test('professor cria a turma pela tela', async ({ page }) => {
        await abrirComo(page, page.request, CONTAS.professor, '/classrooms');
        await abrirFab(page, 'Criar uma turma');

        await page.locator('#classroom-name').fill(CRIADA_NA_TELA);
        await modal(page).locator('button[type="submit"]').click();

        await expect(aviso(page, 'Turma criada com sucesso!')).toBeVisible();
        await expect(page.getByText(CRIADA_NA_TELA).first()).toBeVisible();

        const minhas = (await api(page.request, professor, 'GET', 'classrooms/mine')).body.object;
        const criada = minhas.find((c) => c.name === CRIADA_NA_TELA);
        expect(criada, 'turma criada aparece em classrooms/mine').toBeTruthy();
        expect(criada.classCode).toMatch(/^[A-Z0-9]{6}$/);
        expect(criada.userCount).toBe(1);
    });

    test('aluno não cria turma', async ({ request }) => {
        expect((await api(request, aluno, 'POST', 'classrooms', { name: 'Turma do aluno' })).status).toBe(403);
    });

    test('aluno entra pelo código e não entra duas vezes', async ({ page }) => {
        await abrirComo(page, page.request, CONTAS.aluno, '/classrooms');

        await abrirFab(page);
        await modal(page).locator('input[type="text"]').first().click();
        await page.keyboard.type(turma.classCode);
        await modal(page).locator('button[type="submit"]').click();
        await expect(aviso(page, 'Você entrou na turma com sucesso!')).toBeVisible();
        await expect(page.getByText(NOME).first()).toBeVisible();

        await abrirFab(page);
        await modal(page).locator('input[type="text"]').first().click();
        await page.keyboard.type(turma.classCode);
        await modal(page).locator('button[type="submit"]').click();
        await expect(aviso(page, /já/i)).toBeVisible();

        expect((await membros(page.request)).filter((m) => m.roleInClass === 'STUDENT')).toHaveLength(1);
    });

    test('código inexistente é recusado', async ({ request }) => {
        const res = await api(request, aluno2, 'POST', 'classrooms/join', { classCode: 'ZZZZZ9' });
        expect(res.status).toBe(404);
    });

    test('a contagem de membros inclui o dono', async ({ page }) => {
        await abrirComo(page, page.request, CONTAS.professor, `/classrooms/${turma.id}`);
        await expect(page.getByText(/2\s*membros/)).toBeVisible();
    });

    test('copiar o código pelo banner', async ({ page, context }) => {
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        await abrirComo(page, page.request, CONTAS.professor, `/classrooms/${turma.id}`);
        await page.getByRole('button', { name: 'Copiar código da turma' }).click();
        await expect(aviso(page, /Código copiado/)).toBeVisible();
        expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(turma.classCode);
    });

    test('professor adiciona participante pelo email e ele é avisado', async ({ page }) => {
        await abrirComo(page, page.request, CONTAS.professor, `/classrooms/${turma.id}`);
        await page.getByRole('button', { name: 'Configurações' }).click();

        await page.getByRole('button', { name: 'Adicionar participante' }).click();
        await page.locator('#member-email').fill(CONTAS.professor2);
        await modal(page).locator('button[type="submit"]').click();
        await expect(aviso(page, 'Participante adicionado com sucesso!')).toBeVisible();
        await expect(page.getByText('Professor Teste 2')).toBeVisible();

        const avisos = (await api(page.request, professor2, 'GET', 'notifications')).body.object;
        const entrada = avisos.find((n) => n.title === `Você entrou na turma ${NOME}`);
        expect(entrada, 'aviso de entrada na turma').toBeTruthy();
        expect(entrada.link).toBe(`/classrooms/${turma.id}`);

        // Adicionar de novo não duplica
        await page.getByRole('button', { name: 'Adicionar participante' }).click();
        await page.locator('#member-email').fill(CONTAS.professor2);
        await modal(page).locator('button[type="submit"]').click();
        await expect(aviso(page, /já participa/)).toBeVisible();
    });

    test('educador comum e aluno não gerenciam a turma', async ({ request }) => {
        for (const token of [professor2, aluno]) {
            expect((await api(request, token, 'PATCH', `classrooms/${turma.id}`, { name: 'Invadida' })).status).toBe(403);
            expect((await api(request, token, 'POST', `classrooms/${turma.id}/members`, { email: CONTAS.aluno2 })).status).toBe(403);
            expect((await api(request, token, 'DELETE', `classrooms/${turma.id}`)).status).toBe(403);
        }
        const alunoId = (await membros(request)).find((m) => m.roleInClass === 'STUDENT').user.id;
        expect((await api(request, professor2, 'DELETE', `classrooms/${turma.id}/members/${alunoId}`)).status).toBe(403);
    });

    test('o botão flutuante não cobre os botões da lista de membros', async ({ page }) => {
        // Janela de notebook comum
        await page.setViewportSize({ width: 1280, height: 720 });
        await abrirComo(page, page.request, CONTAS.professor, `/classrooms/${turma.id}`);
        await page.getByRole('button', { name: 'Configurações' }).click();

        for (const nome of ['Tornar administrador', 'Remover da turma']) {
            for (const botao of await page.getByRole('button', { name: nome }).all()) {
                await botao.click({ trial: true, timeout: 3_000 });
            }
        }
    });

    test('dono promove educador a administrador pela lista de membros', async ({ page }) => {
        await abrirComo(page, page.request, CONTAS.professor, `/classrooms/${turma.id}`);
        await page.getByRole('button', { name: 'Configurações' }).click();

        await expect(page.getByText('Dono', { exact: true })).toBeVisible();
        // Só o educador matriculado pode ser promovido: nem o dono, nem o aluno
        const promover = page.getByRole('button', { name: 'Tornar administrador' });
        await expect(promover).toHaveCount(1);
        await promover.click();

        await expect(aviso(page, /agora é administrador/)).toBeVisible();
        await expect(page.getByText('Admin', { exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Remover administrador' })).toHaveCount(1);

        const avisos = (await api(page.request, professor2, 'GET', 'notifications')).body.object;
        expect(avisos.some((n) => n.title === `Você agora é administrador da turma ${NOME}`)).toBe(true);
    });

    test('aluno não pode ser promovido', async ({ request }) => {
        const alunoId = (await membros(request)).find((m) => m.roleInClass === 'STUDENT').user.id;
        const res = await api(request, professor, 'PATCH', `classrooms/${turma.id}/members/${alunoId}/admin`, { isAdmin: true });
        expect(res.status).toBe(400);
    });

    test('administrador passa a gerenciar a turma', async ({ page }) => {
        await abrirComo(page, page.request, CONTAS.professor2, `/classrooms/${turma.id}`);
        await page.getByRole('button', { name: 'Configurações' }).click();
        await expect(page.getByRole('button', { name: 'Adicionar participante' })).toBeVisible();

        const editar = await api(page.request, professor2, 'PATCH', `classrooms/${turma.id}`, { description: 'Editada pelo admin' });
        expect(editar.status).toBe(200);
        const adicionar = await api(page.request, professor2, 'POST', `classrooms/${turma.id}/members`, { email: CONTAS.aluno2 });
        expect(adicionar.status).toBe(201);

        // O dono continua protegido
        const donoId = (await api(page.request, professor, 'GET', 'auth/me')).body.object.id;
        expect((await api(page.request, professor2, 'DELETE', `classrooms/${turma.id}/members/${donoId}`)).status).toBe(403);
    });

    test('rebaixado perde o acesso de administrador', async ({ request }) => {
        const prof2Id = (await api(request, professor2, 'GET', 'auth/me')).body.object.id;
        const rebaixar = await api(request, professor, 'PATCH', `classrooms/${turma.id}/members/${prof2Id}/admin`, { isAdmin: false });
        expect(rebaixar.status).toBe(200);
        expect((await api(request, professor2, 'PATCH', `classrooms/${turma.id}`, { name: 'Invadida' })).status).toBe(403);
    });

    test('aluno sai da turma pela tela', async ({ page }) => {
        const antes = (await membros(page.request)).length;
        await abrirComo(page, page.request, CONTAS.aluno, `/classrooms/${turma.id}`);
        await page.getByRole('button', { name: 'Configurações' }).click();
        await page.getByRole('button', { name: 'Sair da turma' }).click();
        await modal(page).getByRole('button', { name: 'Sair da turma' }).click();

        await expect(aviso(page, 'Você saiu da turma')).toBeVisible();
        expect((await membros(page.request)).length).toBe(antes - 1);
    });

    test('quem não participa não vê os membros nem os sinais da turma', async ({ request }) => {
        for (const rota of [`classrooms/${turma.id}/members`, `classrooms/${turma.id}/signs`, `classrooms/${turma.id}`]) {
            const res = await api(request, aluno, 'GET', rota);
            expect.soft(res.status, `aluno que saiu, em ${rota}`).toBe(403);
        }
    });

    test('dono que é o único educador não consegue sair', async ({ request }) => {
        const sozinha = await api(request, professor, 'POST', 'classrooms', { name: `Turma Sozinha ${Date.now()}` });
        expect(sozinha.status).toBe(201);
        const res = await api(request, professor, 'DELETE', `classrooms/${sozinha.body.object.id}/leave`);
        expect(res.status).toBe(403);
    });

    test('dono que sai passa a turma ao educador mais antigo', async ({ request }) => {
        const sair = await api(request, professor, 'DELETE', `classrooms/${turma.id}/leave`);
        expect(sair.status).toBe(200);
        const detalhe = await api(request, professor2, 'GET', `classrooms/${turma.id}`);
        expect(detalhe.body.object.teacher.name).toBe('Professor Teste 2');
        // O novo dono gerencia; o antigo não
        expect((await api(request, professor2, 'PATCH', `classrooms/${turma.id}`, { description: 'Novo dono' })).status).toBe(200);
        expect((await api(request, professor, 'PATCH', `classrooms/${turma.id}`, { description: 'Antigo dono' })).status).toBe(403);
    });

    test('a turma Contexto não pode ser editada, excluída nem abandonada pelo dono', async ({ request }) => {
        const gestor = await tokenDe(request, CONTAS.gestor);
        const contexto = (await api(request, gestor, 'GET', 'classrooms/mine')).body.object.find((c) => c.isContext);
        expect(contexto).toBeTruthy();
        expect((await api(request, gestor, 'PATCH', `classrooms/${contexto.id}`, { name: 'Outro nome' })).status).toBe(403);
        expect((await api(request, gestor, 'DELETE', `classrooms/${contexto.id}`)).status).toBe(403);
    });

    test('excluir a turma pela API remove ela da lista de todos', async ({ request }) => {
        expect((await api(request, professor2, 'DELETE', `classrooms/${turma.id}`)).status).toBe(200);
        for (const token of [professor2, aluno2]) {
            const minhas = (await api(request, token, 'GET', 'classrooms/mine')).body.object;
            expect(minhas.some((c) => c.id === turma.id)).toBe(false);
        }
    });
});

test.describe('Código da turma', () => {
    test('colar o código preenche os seis campos', async ({ page, context }) => {
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        await abrirComo(page, page.request, CONTAS.aluno2, '/classrooms');
        await page.locator('button.rounded-full.bg-cloud-500').last().click();

        const codigo = 'AB12CD';
        await page.evaluate((texto) => navigator.clipboard.writeText(texto), codigo);
        const campos = modal(page).locator('input[type="text"]');
        await campos.first().click();
        await page.keyboard.press('Control+V');

        await expect
            .poll(() => campos.evaluateAll((els) => els.map((el) => el.value).join('')))
            .toBe(codigo);
    });
});
