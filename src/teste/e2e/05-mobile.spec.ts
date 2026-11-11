// @ts-nocheck
import { test, expect, api, CONTAS, abrirComo, tokenDe } from '../support';

test.use({ viewport: { width: 375, height: 667 }, hasTouch: true, isMobile: true });

test.describe('Turma no celular', () => {
    test('as abas da turma podem ser tocadas, inclusive a última', async ({ page }) => {
        const gestor = await tokenDe(page.request, CONTAS.gestor);
        // A Contexto é a turma com mais abas
        const contexto = (await api(page.request, gestor, 'GET', 'classrooms/mine')).body.object.find((c) => c.isContext);
        await abrirComo(page, page.request, CONTAS.gestor, `/classrooms/${contexto.id}`);

        for (const aba of ['Favoritos', 'Configurações', 'Todos os sinais']) {
            await page.getByRole('button', { name: aba, exact: true }).tap({ timeout: 5_000 });
        }
        await page.getByRole('button', { name: 'Configurações', exact: true }).tap({ timeout: 5_000 });
        await expect(page.getByRole('heading', { name: 'Membros' })).toBeVisible();
    });

    test('o botão Voltar não fica em cima do nome da turma', async ({ page }) => {
        const professor = await tokenDe(page.request, CONTAS.professor);
        const criada = await api(page.request, professor, 'POST', 'classrooms', { name: 'Turma de Informática Avançada' });
        await abrirComo(page, page.request, CONTAS.professor, `/classrooms/${criada.body.object.id}`);

        const voltar = await page.getByRole('button', { name: 'Voltar' }).boundingBox();
        const titulo = await page.getByRole('heading', { level: 1 }).boundingBox();
        const sobrepoe =
            voltar.x < titulo.x + titulo.width && titulo.x < voltar.x + voltar.width &&
            voltar.y < titulo.y + titulo.height && titulo.y < voltar.y + voltar.height;
        expect(sobrepoe).toBe(false);
    });
});
