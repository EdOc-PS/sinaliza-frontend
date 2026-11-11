// @ts-nocheck
import { test, expect } from '@playwright/test';
import { isValidEmail } from '@lib/validation/email';
import { LIMITS } from '@lib/validation/limits';
import { maskPhone } from '@lib/mask/mask';
import { getInitials } from '@lib/format/initials';
import { formatDuration } from '@lib/format/duration';
import { getYouTubeId, getYouTubeThumbnail, isValidYouTubeUrl } from '@lib/youtube/youtube';
import { isPendingApproval } from '@lib/auth/approval';

test.describe('isValidEmail', () => {
    for (const email of ['a@b.com', 'nome.sobrenome@ifmg.edu.br', '  com.espacos@teste.com  ', 'a+tag@dominio.co']) {
        test(`aceita "${email}"`, () => expect(isValidEmail(email)).toBe(true));
    }

    for (const email of ['', 'semarroba.com', 'a@b', 'a@b.c', 'a@b..com', 'a@-dominio.com', 'a@@b.com', 'a b@c.com', '.a@b.com']) {
        test(`recusa "${email}"`, () => expect(isValidEmail(email)).toBe(false));
    }

    test('recusa email acima de 254 caracteres', () => {
        expect(isValidEmail(`${'a'.repeat(60)}@${'b'.repeat(190)}.com`)).toBe(false);
    });

    test('recusa parte local acima de 64 caracteres', () => {
        expect(isValidEmail(`${'a'.repeat(65)}@teste.com`)).toBe(false);
    });
});

test.describe('maskPhone', () => {
    test('formata celular de 11 dígitos', () => expect(maskPhone('31999998888')).toBe('(31) 99999-8888'));
    test('formata fixo de 10 dígitos', () => expect(maskPhone('3133334444')).toBe('(31) 3333-4444'));
    test('ignora letras e símbolos', () => expect(maskPhone('(31) 9a9999-8888')).toBe('(31) 99999-8888'));
    test('corta o que passa de 11 dígitos', () => expect(maskPhone('319999988887777')).toBe('(31) 99999-8888'));
    test('devolve vazio para vazio', () => expect(maskPhone('')).toBe(''));
});

test.describe('formatação', () => {
    test('iniciais usam os dois primeiros nomes', () => expect(getInitials('eduardo octavio silva')).toBe('EO'));
    test('iniciais de nome único', () => expect(getInitials('  Maria ')).toBe('M'));
    test('iniciais de texto vazio', () => expect(getInitials('')).toBe(''));
    test('duração em m:ss', () => expect(formatDuration(75)).toBe('1:15'));
    test('duração inválida fica vazia', () => {
        expect(formatDuration(0)).toBe('');
        expect(formatDuration(NaN)).toBe('');
        expect(formatDuration(-3)).toBe('');
    });
});

test.describe('YouTube', () => {
    const id = 'dQw4w9WgXcQ';

    for (const url of [
        `https://www.youtube.com/watch?v=${id}`,
        `https://youtu.be/${id}`,
        `youtube.com/embed/${id}`,
        `https://m.youtube.com/shorts/${id}`,
    ]) {
        test(`aceita ${url}`, () => expect(isValidYouTubeUrl(url)).toBe(true));
    }

    for (const url of ['', 'https://vimeo.com/123', `https://youtube.com.evil.com/watch?v=${id}`, 'https://youtube.com/watch?v=curto', 'não é link']) {
        test(`recusa "${url}"`, () => expect(isValidYouTubeUrl(url)).toBe(false));
    }

    test('extrai o id e monta a thumbnail', () => {
        expect(getYouTubeId(`https://youtu.be/${id}`)).toBe(id);
        expect(getYouTubeThumbnail(`https://www.youtube.com/watch?v=${id}`)).toBe(`https://img.youtube.com/vi/${id}/hqdefault.jpg`);
        expect(getYouTubeThumbnail('https://vimeo.com/123')).toBeNull();
    });

    // Um link aceito pela validação precisa render thumbnail, senão o card fica sem imagem
    test('link de shorts aceito pela validação também tem id extraível', () => {
        expect(getYouTubeId(`https://www.youtube.com/shorts/${id}`)).toBe(id);
    });
});

test.describe('isPendingApproval', () => {
    test('aluno pendente fica bloqueado', () => {
        expect(isPendingApproval({ roles: ['STUDENT'], approvalStatus: 'PENDING' })).toBe(true);
    });
    test('aluno recusado fica bloqueado', () => {
        expect(isPendingApproval({ roles: ['STUDENT'], approvalStatus: 'REJECTED' })).toBe(true);
    });
    test('aluno aprovado entra', () => {
        expect(isPendingApproval({ roles: ['STUDENT'], approvalStatus: 'APPROVED' })).toBe(false);
    });
    test('educador nunca fica bloqueado', () => {
        expect(isPendingApproval({ roles: ['EDUCATOR'], approvalStatus: null })).toBe(false);
        expect(isPendingApproval({ roles: ['EDUCATOR', 'MANAGER'], approvalStatus: 'PENDING' })).toBe(false);
    });
});

test.describe('LIMITS', () => {
    test('todos os limites são inteiros positivos', () => {
        for (const [chave, valor] of Object.entries(LIMITS)) {
            expect(Number.isInteger(valor) && valor > 0, chave).toBe(true);
        }
    });

    // Mesmos valores validados pelo backend (MaxLength dos DTOs)
    test('limites espelham o backend', () => {
        expect(LIMITS.PASSWORD).toBe(64);
        expect(LIMITS.REVIEW_REASON).toBe(500);
        expect(LIMITS.CATEGORY_NAME).toBe(40);
    });
});
