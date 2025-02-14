import { UpdateUserType } from '@/types/authSchema';
import { http } from '@/utils/actions';

export const userReq = {
  getProfile: async <T>(accessToken: string) => {
    return await http.get<T>('/user/profile', {
      cache: { next: { tags: ['list-user'] } },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  getAll: async <T>(accessToken: string, page: number, name: string) => {
    // console.log(name)
    const newName = name ? `&name=${name}` : '';
    return await http.get<T>(`admin/user?limit=90&page=${page}${newName}`, {
      // cache: { next: { tags: ['list-user'] } },
      cache: { cache: 'no-store' },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  deleteUser: async <T>(accessToken: string, id: string) => {
    return await http.delete<T>(`/api/v1/user/${id}`, {
      tags: ['list-user'],
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  updateUser: async <T>(accessToken: string, body: UpdateUserType) => {
    return await http.patch<T>(
      `/user`,
      { body },
      {
        tags: ['list-user'],
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  },
};
