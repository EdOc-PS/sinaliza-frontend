// @ts-nocheck
import { test as base, expect, type APIRequestContext, type Page } from '@playwright/test';
import { API_URL } from '../playwright.config';

export { expect };

export const SENHA = 'Teste@123';
export const CONTAS = {
    gestor: 'gestor@teste.com',
    professor: 'professor@teste.com',
    professor2: 'professor2@teste.com',
    aluno: 'aluno@teste.com',
    aluno2: 'aluno2@teste.com',
};

// Nenhum teste pode falar com produção: qualquer chamada para fora do localhost é cortada
export const test = base.extend({
    context: async ({ context }, use) => {
        await context.route(/onrender\.com|neon\.tech|vercel\.app/, (route) => route.abort());
        await use(context);
    },
});

let seq = 0;
export const novoEmail = (prefixo: string) => `${prefixo}.${Date.now()}.${seq++}@teste.com`;

export interface Resposta {
    status: number;
    body: any;
}

export async function api(
    request: APIRequestContext,
    token: string | null,
    metodo: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    rota: string,
    data?: unknown,
): Promise<Resposta> {
    const res = await request.fetch(`${API_URL}/${rota}`, {
        method: metodo,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        data,
    });
    const body = await res.json().catch(() => null);
    return { status: res.status(), body };
}

export async function loginApi(request: APIRequestContext, email: string, password = SENHA): Promise<Resposta> {
    return api(request, null, 'POST', 'auth/login', { email, password });
}

export async function tokenDe(request: APIRequestContext, email: string, password = SENHA): Promise<string> {
    const res = await loginApi(request, email, password);
    expect(res.status, `login de ${email}`).toBe(201);
    return res.body.object.access_token;
}

// Login pela tela, como o usuário faz
export async function entrarPelaTela(page: Page, email: string, password = SENHA) {
    await page.goto('/auth/login');
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(password);
    await page.getByRole('button', { name: 'Entrar na minha conta' }).click();
}

// Atalho: já abre a página logado, sem passar pela tela de login
export async function abrirComo(page: Page, request: APIRequestContext, email: string, rota: string, password = SENHA) {
    const token = await tokenDe(request, email, password);
    await page.goto('/auth/login');
    await page.evaluate((t) => localStorage.setItem('@token', t), token);
    await page.goto(rota);
    return token;
}

// Educador criado pelo gestor: nasce com senha temporária
export async function criarEducador(request: APIRequestContext, tokenGestor: string, nome: string, senhaTemporaria: string) {
    const email = novoEmail('educador');
    const res = await api(request, tokenGestor, 'POST', 'users/educator', {
        name: nome,
        email,
        password: senhaTemporaria,
        educatorType: 'TEACHER',
        dataProfile: { department: 'TI', specialty: 'Libras' },
    });
    expect(res.status, JSON.stringify(res.body)).toBe(201);
    return { email, id: res.body.object.id as string };
}

// Educador que já trocou a senha temporária e concluiu o tour
export async function criarEducadorPronto(request: APIRequestContext, tokenGestor: string, nome: string) {
    const { email, id } = await criarEducador(request, tokenGestor, nome, 'Temporaria@1');
    const temporario = await tokenDe(request, email, 'Temporaria@1');
    const troca = await api(request, temporario, 'PATCH', 'auth/password', { newPassword: SENHA });
    expect(troca.status, JSON.stringify(troca.body)).toBe(200);
    const token = troca.body.object.access_token as string;
    await api(request, token, 'PATCH', 'users/me/onboarding', {});
    return { email, id, token };
}

export const modal = (page: Page) => page.locator('div.fixed.inset-0').last();

export const aviso = (page: Page, texto: string | RegExp) =>
    page.locator('[data-sonner-toast]').filter({ hasText: texto }).first();
