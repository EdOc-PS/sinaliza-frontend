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

  // Opcional: Remova o interceptor de resposta ou deixe-o apenas para logar erros.
  // Se você deixar o redirecionamento aqui, a recursividade do PostRequest não funcionará.
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Apenas repassa o erro para que o PostRequest/GetRequest trate no Switch Case
      return Promise.reject(error);
    }
  );

  apiInstance = api;
  return api;
}

export const api = getAPIClient();