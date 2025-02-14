// 'use server'
import { sendRequest } from './http';

export const http = {
  get<T>(url: string, options?: any | undefined) {
    return sendRequest<T>('GET', url, options);
  },
  post<T>(url: string, body?: any, options?: any | undefined) {
    return sendRequest<T>('POST', url, { ...options, ...body });
  },
  patch<T>(url: string, body: any, options?: any | undefined) {
    return sendRequest<T>('PATCH', url, { ...options, ...body });
  },
  put<T>(url: string, body: any, options?: any | undefined) {
    return sendRequest<T>('PUT', url, { ...options, ...body });
  },
  delete<T>(url: string, body: any, options?: any | undefined) {
    return sendRequest<T>('DELETE', url, { ...options, ...body });
  },
};
