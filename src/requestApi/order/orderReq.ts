import { OrderStatusType } from '@/types/orderStatusSchema';
import { http } from '@/utils/actions';

export const orderReq = {
  //user
  getOrderDetail: async <T>(body: any, accessToken: string) => {
    return http.post<T>(`/order/check-order-user`, { body }, { headers: { Authorization: `Bearer ${accessToken}` } });
  },
  getMyOrder: async <T>(body: { userId: number }, accessToken: string, page: number = 1, type: string) => {
    const query = type ? `&type=${type}` : '';
    return http.post<T>(
      `/order/list?page=${page}&limit=15${query}`,
      { body },
      {
        cache: { next: { tags: ['list-order'] } },
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  },

  //admin/order
  create: async <T>(body: any) => {
    return http.post<T>(`/order`, { body }, { tags: ['list-order'] });
  },
  postVar: async <T>(body: number[]) => {
    return http.post<T>(
      `/variant/active`,
      { body },
      {
        tags: ['list-order'],
      }
    );
  },
  getAll: async <T>(page: number, accessToken: string) => {
    return http.get<T>(`admin/order?page=${page}&limit=20`, {
      cache: { next: { tags: ['list-order'] } },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  getOne: async <T>(id: string, accessToken: string) => {
    return http.get<T>(`/order/${id}`, {
      cache: { next: { tags: ['list-order'] } },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  updateStatus: async <T>(id: number, body: OrderStatusType, accessToken: string) => {
    // console.log('body---->', body, accessToken);
    return http.patch<T>(
      `/admin/order/update-status/${id}`,
      { body },
      {
        tags: ['list-order'],
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  },
};
