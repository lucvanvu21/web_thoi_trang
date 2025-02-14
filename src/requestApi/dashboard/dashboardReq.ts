import { http } from '@/utils/actions';

export const dashboardReq = {
  getThongKeBanHang: async <T>(accessToken: string) => {
    return http.get<T>(`/admin/order/sales-statistic`, {
      cache: { next: { tags: ['list-order'] } },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  tongDoanhThu: async <T>(accessToken: string) => {
    return http.get<T>(`/admin/order/total-revenue`, {
      cache: { next: { tags: ['list-order'] } },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  getOverview: async <T>(accessToken: string) => {
    return http.get<T>(`/admin/order/overview`, {
      cache: { next: { tags: ['list-order'] } },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  getTopSellingProducts: async <T>(accessToken: string) => {
    return http.get<T>(`/admin/product/top-selling`, {
      cache: { next: { tags: ['list-order'] } },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  totalOrder: async <T>(accessToken: string) => {
    return http.get<T>(`/admin/order/total-order`, {
      cache: { next: { tags: ['list-order'] } },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  totalProduct: async <T>(accessToken: string) => {
    return http.get<T>(`/admin/product/total-product`, {
      cache: { next: { tags: ['list-product'] } },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};
