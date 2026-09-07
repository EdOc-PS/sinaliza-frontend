import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

// Em produção (hospedado), defina VITE_API_URL nas variáveis de ambiente do build.
// Localmente, sem essa variável, cai no backend rodando em localhost.
const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3004';

let apiInstance: AxiosInstance | null = null;

export function getAPIClient(): AxiosInstance {
  if (apiInstance) {
    return apiInstance;
  }

  const api = axios.create({
    baseURL: BASE_API_URL,
    timeout: 10000,
  });

  // Pega o token mais recente do localStorage antes de sair.
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Verificar se localStorage
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
      if (error.response?.status === 401 && typeof window !== 'undefined') {
        const message = error.response?.data?.message || '';
        if (message.includes('Token') || message.includes('token')) {
          localStorage.clear();
          window.location.href = '/auth/login';
        }
      }
      return Promise.reject(error);
    }
  );

  apiInstance = api;
  return api;
}

export const api = getAPIClient();