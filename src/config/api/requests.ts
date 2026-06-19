import { api } from './client';

// ─────────────────────────────────────────────
// Tipos alinhados com ApiResponse<T> do backend
// ─────────────────────────────────────────────

export type APIResponse<T = unknown> = {
  success: boolean;
  message: string;
  object?: T;
  errors?: Record<string, string[]>;
};

// ─────────────────────────────────────────────
// Tipos de domínio (espelham o backend)
// ─────────────────────────────────────────────

export type Role = 'STUDENT' | 'EDUCATOR' | 'GUARDIAN' | 'ADMIN';
export type EducatorType = 'TEACHER' | 'INTERPRETER';
export type LibrasLevel = 'BASICO' | 'INTERMEDIARIO' | 'AVANCADO' | 'FLUENTE';

export type DataProfile = {
  institute?: string;
  // STUDENT
  grauEscolar?: string;
  necessidadesEspeciais?: string;
  // EDUCATOR (Professor ou Intérprete — identificado por educatorType)
  department?: string;
  specialty?: string;
  educatorType?: EducatorType;
  // Campos extras se educatorType = INTERPRETER
  certificate?: string;
  areaAtuacao?: string;
  proficienciaLibras?: LibrasLevel;
  // GUARDIAN
  parentesco?: string;
  studentEmail?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthdate?: string;
  avatar?: string;
  bio?: string;
  status: boolean;
  roles: Role[];
  educatorType?: EducatorType | null;
  institute?: string | null;
  dataProfile?: DataProfile | null;
  createdAt: string;
  updatedAt: string;
};

// ─────────────────────────────────────────────
// Payloads de requisição
// ─────────────────────────────────────────────

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  birthdate?: string;
  bio?: string;
  dataProfile: DataProfile;
};

export type UpdateUserPayload = {
  name?: string;
  email?: string;
  password?: string;
  birthdate?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  status?: boolean;
  dataProfile?: Partial<DataProfile>;
};

export type UpdateRolesPayload = {
  roles: Role[];
};

export type LoginResponse = {
  access_token: string;
  user: User;
};

// ─────────────────────────────────────────────
// Helpers internos
// ─────────────────────────────────────────────

function handleError<T>(error: unknown): APIResponse<T> {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as { response: { status: number; data: { message?: string; errors?: Record<string, string[]> } } };
    const { status, data } = axiosError.response;

    switch (status) {
      case 400:
        return { success: false, message: data.message ?? 'Requisição inválida.', errors: data.errors };
      case 401:
        const isExpiredSession = !data.message || data.message.includes('Sessão') || data.message.includes('token');
        if (isExpiredSession && typeof window !== 'undefined') {
          localStorage.clear();
        }
        return { success: false, message: data.message ?? 'Acesso não autorizado.' };
      case 403:
        return { success: false, message: 'Acesso negado.' };
      case 404:
        return { success: false, message: data.message ?? 'Recurso não encontrado.' };
      case 409:
        return { success: false, message: data.message ?? 'Conflito de dados.' };
      case 500:
        return { success: false, message: data.message ?? 'Erro interno no servidor.' };
      default:
        return { success: false, message: 'Erro inesperado.' };
    }
  }

  return { success: false, message: 'Sem conexão com o servidor.' };
}

// ─────────────────────────────────────────────
// GET
// ─────────────────────────────────────────────

export async function GetRequest<T>(
  path: string,
  params?: Record<string, unknown>
): Promise<APIResponse<T>> {
  try {
    const result = await api.get<APIResponse<T>>(path, { params });
    return result.data;
  } catch (error) {
    return handleError<T>(error);
  }
}

// ─────────────────────────────────────────────
// POST
// ─────────────────────────────────────────────

export async function PostRequest<T>(
  path: string,
  data: unknown
): Promise<APIResponse<T>> {
  try {
    const result = await api.post<APIResponse<T>>(path, data);
    return result.data;
  } catch (error) {
    return handleError<T>(error);
  }
}

// ─────────────────────────────────────────────
// PATCH
// ─────────────────────────────────────────────

export async function PatchRequest<T>(
  path: string,
  data: unknown
): Promise<APIResponse<T>> {
  try {
    const result = await api.patch<APIResponse<T>>(path, data);
    return result.data;
  } catch (error) {
    return handleError<T>(error);
  }
}

// ─────────────────────────────────────────────
// POST (multipart/form-data)
// ─────────────────────────────────────────────

export async function PostFormDataRequest<T>(
  path: string,
  data: FormData
): Promise<APIResponse<T>> {
  try {
    const result = await api.post<APIResponse<T>>(path, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return result.data;
  } catch (error) {
    return handleError<T>(error);
  }
}

// ─────────────────────────────────────────────
// PATCH (multipart/form-data)
// ─────────────────────────────────────────────

export async function PatchFormDataRequest<T>(
  path: string,
  data: FormData
): Promise<APIResponse<T>> {
  try {
    const result = await api.patch<APIResponse<T>>(path, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return result.data;
  } catch (error) {
    return handleError<T>(error);
  }
}

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────

export async function DeleteRequest<T>(
  path: string
): Promise<APIResponse<T>> {
  try {
    const result = await api.delete<APIResponse<T>>(path);
    return result.data;
  } catch (error) {
    return handleError<T>(error);
  }
}

