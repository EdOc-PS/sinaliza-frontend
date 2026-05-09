import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

const BASE_API_URL = 'http://localhost:3000';

let apiInstance: AxiosInstance | null = null;

export function getAPIClient(): AxiosInstance {
  if (apiInstance) {
    return apiInstance;
  }

  const api = axios.create({
    baseURL: BASE_API_URL,
    timeout: 10000,
  });

  // Mantenha este interceptor: ele garante que toda requisição
  // pegue o token mais recente do localStorage antes de sair.
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Verificar se localStorage existe (evita erro em SSR)
    if (typeof window !== 'undefined') {
      const freshToken = localStorage.getItem('@token');
      if (freshToken) {
        config.headers.Authorization = `Bearer ${freshToken}`;
      }
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Token expirado/inválido → só redireciona se a requisição enviou Bearer token
      const sentToken = error.config?.headers?.Authorization;
      if (error.response?.status === 401 && sentToken && typeof window !== 'undefined') {
        localStorage.clear();
        window.location.href = '/auth/login';
      }
      return Promise.reject(error);
    }
  );

  apiInstance = api;
  return api;
}

export const api = getAPIClient();