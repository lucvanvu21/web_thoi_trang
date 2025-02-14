'use server'

import { OrderStatusType } from "@/types/orderStatusSchema";
import { revalidateTag } from "next/cache";

export const updateStatus = async (id: number, body: OrderStatusType, accessToken: string) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL + `/admin/order/update-status/${id}`;
    // console.log('body---->', backendUrl,body, accessToken);
    const res = await fetch(`${backendUrl}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    revalidateTag('list-order');
    // console.log('res---->', res);
    if (!res.ok) {
      return {
        statusCode: res?.status,
        errorr:'Lỗi',
        message: res.statusText || 'Lỗi khi lấy dữ liệu',
      };
    }
    const payload = await res.json();
    // console.log('payload---->', payload);
    return payload;
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message,
    };
  }
};