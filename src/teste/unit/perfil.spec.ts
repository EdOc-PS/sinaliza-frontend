// @ts-nocheck
import { test, expect } from '@playwright/test';
import { PERFIL_FORMULARIOS, getPerfilId } from '@lib/constants/profileFields';

test.describe('getPerfilId', () => {
    test('aluno', () => expect(getPerfilId(['STUDENT'])).toBe('student'));
    test('professor', () => expect(getPerfilId(['EDUCATOR'], 'TEACHER')).toBe('educator'));
    test('intérprete', () => expect(getPerfilId(['EDUCATOR'], 'INTERPRETER')).toBe('interpreter'));
    test('gestor usa o perfil de educador', () => expect(getPerfilId(['EDUCATOR', 'MANAGER'], 'TEACHER')).toBe('educator'));
    test('sem perfil conhecido', () => expect(getPerfilId([])).toBeNull());
});

test.describe('campos de perfil', () => {
    const obrigatorios = (perfil) =>
        PERFIL_FORMULARIOS[perfil].campos.filter((c) => !c.optional).map((c) => c.id);

    test('intérprete: só a proficiência em Libras é obrigatória', () => {
        expect(obrigatorios('interpreter')).toEqual(['proficienciaLibras']);
    });

    test('professor: departamento e especialidade são obrigatórios', () => {
        expect(obrigatorios('educator')).toEqual(['department', 'specialty']);
    });

    test('aluno: só o grau escolar é obrigatório', () => {
        expect(obrigatorios('student')).toEqual(['grauEscolar']);
    });

    test('todo campo de seleção tem opções', () => {
        for (const { campos } of Object.values(PERFIL_FORMULARIOS)) {
            for (const campo of campos.filter((c) => c.kind === 'select')) {
                expect(campo.options?.length, campo.id).toBeGreaterThan(0);
            }
        }
    });
});
