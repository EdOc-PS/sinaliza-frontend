// Limites de caracteres dos campos de texto. Onde o backend já valida
// (MaxLength nos DTOs), o valor aqui é o mesmo — mudar um exige mudar o outro.
export const LIMITS = {
    NAME: 100,
    EMAIL: 254,
    PHONE: 15, // "(31) 99999-9999"
    PASSWORD: 64,
    BIO: 300,
    PROFILE_FIELD: 100,

    CLASSROOM_NAME: 60,
    CLASSROOM_DESCRIPTION: 300,

    SIGN_NAME: 60,
    SIGN_EXAMPLE: 200,
    SIGN_MOVEMENT: 500,
    URL: 300,
    TAG: 30,
    TAGS_MAX: 15,

    CATEGORY_NAME: 40, // backend: MaxLength(40)
    GLOSSARY_DISCIPLINE_NAME: 60, // backend: MaxLength(60)
    GLOSSARY_DISCIPLINE_DESCRIPTION: 200, // backend: MaxLength(200)
    HAND_CONFIG_NAME: 50,

    ESSAY_TITLE: 150, // backend: MaxLength(150)
    ESSAY_DESCRIPTION: 1000, // backend: MaxLength(1000)

    REVIEW_REASON: 500, // backend: MaxLength(500)
    SEARCH: 80,
} as const;
