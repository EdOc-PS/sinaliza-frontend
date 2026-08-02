// Validação de e-mail alinhada com o @IsEmail() do backend (validator.js).
// O regex antigo (`[^\s@]+@[^\s@]+\.[^\s@]+`) aceitava endereços que o backend
// recusava — ex: "a@b.c", "a@b..com", "a@-dominio.com" — e o usuário só descobria
// o erro ao enviar o formulário.
const EMAIL_REGEX =
    /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

export function isValidEmail(value: string): boolean {
    const email = value.trim();

    // Limites do RFC 5321: 254 no total, 64 na parte local
    if (!email || email.length > 254) return false;

    const [local, ...domainParts] = email.split("@");
    if (domainParts.length !== 1) return false;
    if (!local || local.length > 64) return false;

    // Nenhum rótulo do domínio pode passar de 63 caracteres
    if (domainParts[0].split(".").some((label) => label.length > 63)) return false;

    return EMAIL_REGEX.test(email);
}

export default isValidEmail;
