import type { User } from "@api/requests";

// Conta STUDENT/GUARDIAN criada publicamente que ainda não foi aprovada pelo gestor.
// Educadores/gestores (contas criadas internamente) nunca ficam bloqueados.
export const isPendingApproval = (
    user: Pick<User, "roles" | "approvalStatus">,
): boolean => {
    const privileged = user.roles?.includes("EDUCATOR") || user.roles?.includes("MANAGER");
    if (privileged) return false;
    return user.approvalStatus != null && user.approvalStatus !== "APPROVED";
};
