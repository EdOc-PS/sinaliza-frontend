// @ts-nocheck
import { test, expect, api, aviso, CONTAS, SENHA, entrarPelaTela, abrirComo, criarEducadorPronto, loginApi, novoEmail, tokenDe } from '../support';

test.describe('Login', () => {
    test('sem login, as telas internas mandam para o login', async ({ page }) => {
        for (const rota of ['/classrooms', '/notifications', '/profile', '/members']) {
            await page.goto(rota);
            await expect(page).toHaveURL(/\/auth\/login$/);
        }
    });

    test('login certo abre as turmas', async ({ page }) => {
        await entrarPelaTela(page, CONTAS.professor);
        await expect(page).toHaveURL(/\/classrooms$/);
        await expect(aviso(page, 'Login realizado com sucesso!')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Minhas turmas' })).toBeVisible();
    });

    test('senha errada avisa e continua na tela de login', async ({ page }) => {
        const { email } = await criarEducadorPronto(page.request, await tokenDe(page.request, CONTAS.gestor), 'Senha Errada');
        await entrarPelaTela(page, email, 'senha-errada');
        await expect(aviso(page, /Senha inválida\. 5 tentativas restantes/)).toBeVisible();
        await expect(page).toHaveURL(/\/auth\/login$/);
    });

    test('email não cadastrado avisa', async ({ page }) => {
        await entrarPelaTela(page, 'ninguem@teste.com');
        await expect(aviso(page, /Email não encontrado/)).toBeVisible();
    });

    test('botão de entrar fica bloqueado com email inválido', async ({ page }) => {
        await page.goto('/auth/login');
        await page.locator('#email').fill('email-invalido');
        await expect(page.getByText('Digite um e-mail válido.')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Entrar na minha conta' })).toBeDisabled();
    });

    test('sair derruba a sessão', async ({ page }) => {
        // O botão "Sair da conta" do perfil só existe no layout de celular
        await page.setViewportSize({ width: 390, height: 844 });
        await abrirComo(page, page.request, CONTAS.aluno2, '/profile');
        await page.getByRole('button', { name: 'Sair da conta' }).click();
        await page.getByRole('button', { name: 'Sair', exact: true }).click();
        await expect(page).toHaveURL(/\/auth\/login$/);
        await page.goto('/classrooms');
        await expect(page).toHaveURL(/\/auth\/login$/);
    });
});

test.describe('Bloqueio por tentativas', () => {
    test('a sexta senha errada bloqueia a conta, até com a senha certa', async ({ page }) => {
        const { email } = await criarEducadorPronto(page.request, await tokenDe(page.request, CONTAS.gestor), 'Conta Bloqueada');

        for (let tentativa = 1; tentativa <= 5; tentativa++) {
            const res = await loginApi(page.request, email, 'errada');
            expect(res.status, `tentativa ${tentativa}`).toBe(401);
        }
        const sexta = await loginApi(page.request, email, 'errada');
        expect(sexta.status).toBe(403);
        expect(sexta.body.message).toMatch(/bloqueada/i);

        const certa = await loginApi(page.request, email, SENHA);
        expect(certa.status).toBe(403);
    });

    test('a tela de login explica que a conta está bloqueada', async ({ page }) => {
        const { email } = await criarEducadorPronto(page.request, await tokenDe(page.request, CONTAS.gestor), 'Aviso Bloqueio');
        for (let tentativa = 1; tentativa <= 6; tentativa++) await loginApi(page.request, email, 'errada');

        await entrarPelaTela(page, email, SENHA);
        await expect(aviso(page, /Conta bloqueada/)).toBeVisible();
        await expect(page).toHaveURL(/\/auth\/login$/);
    });
});

test.describe('Cadastro de aluno', () => {
    const cadastro = (email: string, extra = {}) => ({
        name: 'Aluno Novo',
        email,
        password: SENHA,
        role: 'STUDENT',
        dataProfile: { grauEscolar: 'ENSINO_MEDIO_COMPLETO' },
        ...extra,
    });

    test('conta nova fica pendente, o gestor é avisado e a aprovação libera o acesso', async ({ page }) => {
        const email = novoEmail('aluno');
        const criado = await api(page.request, null, 'POST', 'auth/register', cadastro(email));
        expect(criado.status, JSON.stringify(criado.body)).toBe(201);

        // Pendente: entra, mas cai na tela de espera
        await entrarPelaTela(page, email);
        await expect(page).toHaveURL(/\/pending$/);
        await page.goto('/classrooms');
        await expect(page).toHaveURL(/\/pending$/);

        const gestor = await tokenDe(page.request, CONTAS.gestor);
        const avisosGestor = await api(page.request, gestor, 'GET', 'notifications');
        expect(avisosGestor.body.object.some((n) => n.title === 'Nova conta aguardando análise')).toBe(true);

        const pendente = await tokenDe(page.request, email);
        const idAluno = (await api(page.request, pendente, 'GET', 'auth/me')).body.object.id;
        const aprovado = await api(page.request, gestor, 'PATCH', `users/${idAluno}/approval`, { status: 'APPROVED' });
        expect(aprovado.status, JSON.stringify(aprovado.body)).toBe(200);

        await entrarPelaTela(page, email);
        await expect(page).toHaveURL(/\/classrooms$/);

        // Uma aprovação gera um único aviso para o aluno
        const avisosAluno = await api(page.request, await tokenDe(page.request, email), 'GET', 'notifications');
        expect(avisosAluno.body.object.filter((n) => n.title === 'Sua conta foi aprovada!')).toHaveLength(1);
    });

    test('aluno não aprova a própria conta', async ({ page }) => {
        const email = novoEmail('aluno');
        await api(page.request, null, 'POST', 'auth/register', cadastro(email));
        const token = await tokenDe(page.request, email);
        const id = (await api(page.request, token, 'GET', 'auth/me')).body.object.id;
        const res = await api(page.request, token, 'PATCH', `users/${id}/approval`, { status: 'APPROVED' });
        expect(res.status).toBe(403);
    });

    test('ninguém se cadastra como gestor pela rota pública', async ({ page }) => {
        const email = novoEmail('intruso');
        const res = await api(page.request, null, 'POST', 'auth/register', cadastro(email, { role: 'MANAGER' }));
        expect(res.status, JSON.stringify(res.body)).toBeGreaterThanOrEqual(400);

        // Mesmo que a conta tenha sido criada, não pode ter saído com perfil de gestor
        const login = await loginApi(page.request, email);
        if (login.status === 201) {
            expect(login.body.object.user.roles).not.toContain('MANAGER');
        }
    });

    test('email repetido é recusado', async ({ page }) => {
        const res = await api(page.request, null, 'POST', 'auth/register', cadastro(CONTAS.aluno));
        expect(res.status).toBeGreaterThanOrEqual(400);
        expect(res.body.message).toMatch(/já registrado/i);
    });
});

test.describe('Dados sensíveis', () => {
    test('nenhuma resposta devolve o hash da senha', async ({ page }) => {
        const login = await loginApi(page.request, CONTAS.gestor);
        const gestor = login.body.object.access_token;
        const respostas = [
            login,
            await api(page.request, gestor, 'GET', 'auth/me'),
            await api(page.request, gestor, 'GET', 'users'),
            await api(page.request, gestor, 'GET', 'users/educators'),
            await api(page.request, gestor, 'GET', 'users/members?role=STUDENT'),
        ];
        for (const res of respostas) {
            expect(JSON.stringify(res.body)).not.toMatch(/"password"\s*:/);
        }
    });

    test('o cadastro público não devolve o hash da senha', async ({ page }) => {
        const res = await api(page.request, null, 'POST', 'auth/register', {
            name: 'Aluno Hash',
            email: novoEmail('hash'),
            password: SENHA,
            role: 'STUDENT',
            dataProfile: { grauEscolar: 'ENSINO_MEDIO_COMPLETO' },
        });
        expect(res.status).toBe(201);
        expect(Object.keys(res.body.object)).not.toContain('password');
    });

    test('rotas de gestor recusam aluno e educador comum', async ({ page }) => {
        for (const conta of [CONTAS.aluno, CONTAS.professor]) {
            const token = await tokenDe(page.request, conta);
            for (const rota of ['users', 'users/educators', 'users/members?role=STUDENT']) {
                const res = await api(page.request, token, 'GET', rota);
                expect(res.status, `${conta} em ${rota}`).toBe(403);
            }
        }
    });

    test('requisição sem token é recusada', async ({ page }) => {
        for (const rota of ['auth/me', 'classrooms/mine', 'notifications', 'users']) {
            expect((await api(page.request, null, 'GET', rota)).status, rota).toBe(401);
        }
    });
});
