import { ProductBodyType } from '@/types/productSchema';
import { http } from '@/utils/actions';

export const productReq = {
  //user
  getAllOrSearch: async <T>(page: number = 1, limit: number = 24, name: string, sort?: string) => {
    return await http.get<T>(`product?page=${page}&limit=${limit}&name=${name}&sort=${sort}`, {
      cache: { next: { tags: ['list-product'] } },
    });
  },
  getByStatus: async <T>(status: string, page: number, limit: number = 24, sort?: string) => {
    return await http.get<T>(`product/${status}?page=${page}&limit=${limit}&sort=${sort}`, {
      cache: { next: { tags: ['list-product'] } },
      // cache: { cache: 'no-store' },
    });
  },
  getByCategory: async <T>(slug: string, page: number = 1, limit: number = 24, sort?: string) => {
    return await http.get<T>(`/product/category/${slug}?page=${page}&limit=${limit}&sort=${sort}`, {
      cache: { next: { tags: ['list-product'] } },
      // cache: { cache: 'no-store' },
    });
  },
  getProductBySlug: async <T>(slug: string) => {
    return await http.get<T>(`/product/${slug}`, {
      cache: { next: { tags: ['list-product'] } },
    });
  },
  getByPrice: async <T>(page: number, sort?: string, price?: number) => {
    return await http.get<T>(`product/price?page=${page}&limit=24&sort=${sort}&price=${price}`, {
      // cache: { next: { tags: ['list-product'] } },
      cache : { cache: 'no-store' },
    });
  },
  //admin/product
  getAll: async <T>(accessToken: string,page: number =1 , limit: number = 20) => {
    return await http.get<T>(`admin/product?page=${page}&limit=${limit}`, {
      cache: { next: { tags: ['list-product'] } },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  addProduct: async <T>(body: ProductBodyType, accessToken: string) => {
    return await http.post<T>(
      'admin/product',
      { body },
      {
        tags: ['list-product'],
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  },
  updateProduct: async <T>(id: number, body: ProductBodyType, accessToken: string) => {
    return await http.patch<T>(
      `admin/product/${id}`,
      { body },
      {
        tags: ['list-product'],
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  },
  deleteProduct: async <T>(id: number, accessToken: string) => {
    return await http.delete<T>(`admin/product/${id}`, {
      tags: ['list-product'],
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  getProduct: async <T>(id: number, accessToken: string) => {
    return await http.get<T>(`admin/product/${id}`, {
      cache: { next: { tags: ['list-product'] } },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};
