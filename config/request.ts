import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getSession, signIn } from 'next-auth/react';

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REQUEST_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// request.interceptors.request.use(
//   async (config: InternalAxiosRequestConfig) => {
//     if (config.headers.Authorization) {
//       return config;
//     } else {
//       await getSession().then((res) => {
//         return res?.user ? (config.headers.Authorization = `Bearer ${res?.user.token}`) : delete config.headers.Authorization;
//       });
//       return config;
//     }
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

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
          signIn(process.env.NEXT_PUBLIC_AUTH_AAD_B2C_PROVIDER_ID);
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
    return Promise.reject(error);
  }
);
export default request;
