'use server';

import { revalidateTag } from 'next/cache';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const sendRequest = async <T>(method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE', url: string, options?: any) => {
  try {
    const body = options?.body ? JSON.stringify(options.body) : undefined;
    // console.log('---->options:', options);
    const nextTags = options?.cache ? options.cache : undefined;
    const key = options?.tags ? options.tags : undefined;
    const baseHeader = {
      'Content-type': 'application/json',
    };
    const fullUrl = url.startsWith('/') ? `${backendUrl}${url}` : `${backendUrl}/${url}`;
    console.log('---->tags:',fullUrl, nextTags, key);
    // console.log('---->fullUrl:', fullUrl, '---->body:', body, '--->option:', options);
    const res = await fetch(fullUrl, {
      cache: 'force-cache',
      headers: {
        ...baseHeader,
        ...options?.headers,
      },
      body,
      ...nextTags,
      method,
    });
    // console.log('---->res:', res);
    if (key) {
      revalidateTag(`${key[0]}`);
    }
    const payload = await res.json();
    // console.log('---->payload:', payload);
    if (!res.ok) {
      // Trả về lỗi mà không gây ra lỗi cho frontend
      // console.log('---->error:', res);
      return { statusCode: res?.status, error: payload?.error || 'err', message: payload.message || 'Lỗi khi lấy dữ liệu' } as T;
    }
    return payload as T;
  } catch (error: any) {
    // console.log('---->error-------->:', error);
    return { statusCode: 400, error: 'Lỗi', message: error.message || 'Lỗi khi lấy dữ liệu' } as T;
  }
};
