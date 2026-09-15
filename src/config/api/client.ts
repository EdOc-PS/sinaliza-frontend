import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Em produção (hospedado), defina VITE_API_URL nas variáveis de ambiente do build.
// Localmente, sem essa variável, cai no backend rodando em localhost.
const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3004';

// O backend roda em hospedagem free (Render) e "dorme" após um tempo sem uso.
// A primeira requisição depois disso pode levar dezenas de segundos para acordar
// a instância — nesse meio tempo a conexão falha (sem resposta) ou o proxy do
// Render devolve 502/503/504 enquanto o app ainda não subiu.
//
// Em vez de mostrar erro na primeira falha, tentamos de novo silenciosamente com
// backoff crescente. Soma dos atrasos ~49s, cobrindo o cold start típico do plano
// free sem deixar o usuário esperando indefinidamente.
const RETRY_DELAYS_MS = [2000, 4000, 8000, 15000, 20000];

type RetryableConfig = InternalAxiosRequestConfig & { __retryCount?: number };

// Sem resposta = erro de rede/timeout (instância dormindo ou ainda subindo).
// 502/503/504 = proxy do Render respondeu, mas o app atrás dele ainda não está pronto.
function isColdStartError(error: AxiosError): boolean {
  if (!error.response) return true;
  return [502, 503, 504].includes(error.response.status);
}

let apiInstance: AxiosInstance | null = null;

export function getAPIClient(): AxiosInstance {
  if (apiInstance) {
    return apiInstance;
  }

  const api = axios.create({
    baseURL: BASE_API_URL,
    timeout: 15000,
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
    async (error: AxiosError) => {
      const config = error.config as RetryableConfig | undefined;

      if (config && isColdStartError(error)) {
        const attempt = config.__retryCount ?? 0;
        if (attempt < RETRY_DELAYS_MS.length) {
          config.__retryCount = attempt + 1;
          if (import.meta.env.DEV) {
            console.debug(`[api] tentativa ${attempt + 1}/${RETRY_DELAYS_MS.length} após falha, aguardando ${RETRY_DELAYS_MS[attempt]}ms`);
          }
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
          return api(config);
        }
      }

      if (error.response?.status === 401 && typeof window !== 'undefined') {
        const message = (error.response?.data as { message?: string } | undefined)?.message || '';
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
