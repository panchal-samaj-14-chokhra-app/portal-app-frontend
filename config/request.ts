import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { endSession, forceRefresh, getAccessToken } from '@/lib/auth/client';

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REQUEST_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Every call carries the logged-in user's access token (renewed in the background, see lib/auth/client.ts).
request.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (typeof window === 'undefined' || config.headers.Authorization) return config;
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      if (
        error.request.responseType === 'blob' &&
        error.response.data instanceof Blob &&
        error.response.data.type &&
        error.response.data.type.toLowerCase().indexOf('json') != -1
      ) {
        await new Promise((resolve) => {
          let reader: FileReader = new FileReader();
          reader.onload = () => {
            error.response.data = JSON.parse((reader?.result || '') as string);
            resolve('');
          };
          reader.onerror = () => {
            resolve('');
          };
          reader.readAsText(error.response.data);
        });
      }
      const { status, data } = error.response;
      switch (status) {
        case 400:
          console.error('Bad Request:', data);
          break;
        case 401:
          console.error('Unauthorized:', data);
          break;
        case 404:
          console.error('Not Found:', data);
          break;
        default:
          console.error('Error:', data);
          break;
      }
    } else {
      console.error('Error:', error.message);
    }

    // 401 = the access token was refused. Ask for a fresh one once and repeat the call; if the login
    // cannot be renewed any more, go to the login page (once) instead of leaving a broken screen.
    const config = error.config as (InternalAxiosRequestConfig & { _authRetried?: boolean }) | undefined;
    if (error.response?.status === 401 && config && typeof window !== 'undefined' && !config._authRetried) {
      config._authRetried = true;
      const code = error.response.data?.code;
      if (code !== 'ACCOUNT_DISABLED') {
        const token = await forceRefresh();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          return request(config);
        }
      }
      endSession(code === 'ACCOUNT_DISABLED' ? 'disabled' : 'expired');
    } else if (error.response?.status === 401 && config?._authRetried && typeof window !== 'undefined') {
      // even a freshly renewed token was refused: the login is no longer valid
      endSession(error.response.data?.code === 'ACCOUNT_DISABLED' ? 'disabled' : 'expired');
    }
    return Promise.reject(error);
  }
);
export default request;
