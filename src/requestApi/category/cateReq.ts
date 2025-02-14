import { CreateCategoryType } from '@/types/categorySchema';
import { http } from '@/utils/actions';
export const cateReq = {
  getCategory: async <T>() => {
    return await http.get<T>('category', {
      cache: { next: { tags: ['list-category'] } },
    });
  },
  //admin
  getAll: async <T>(accessToken: string) => {
    return await http.get<T>('admin/category', {
      cache: { next: { tags: ['list-category'] } },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  createCategory: async <T>(accessToken: string, body: CreateCategoryType) => {
    return await http.post<T>('admin/category', { body }, {
      tags: ['list-category'],
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  updateCategory: async <T>(accessToken: string, body: CreateCategoryType) => {
    return await http.patch<T>('admin/category', { body }, {
      tags: ['list-category'],
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  deleteCategory: async <T>(accessToken: string, id: number) => {
    return await http.delete<T>(`admin/category/${id}`, {
      tags: ['list-category'],
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};
