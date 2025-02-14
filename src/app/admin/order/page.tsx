import TableProduct from '@/components/admin/tableProduct';
import { orderReq } from '@/requestApi/order/orderReq';
import { OrderPaginateType, OrderType } from '@/types/indexType';
import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import React from 'react';
import { OrderColumns } from './orderColumn';

const OrderPage = async ({ searchParams }: { searchParams: { page: number } }) => {
  const token = await getServerSession(authOptions);
  const page = searchParams.page || 1;
  // console.log(page, token);
  const res = await orderReq.getAll<OrderPaginateType>(page, token.accessToken);
  // console.log(res);
  if (!res.items) return <div>Không có dữ liệu</div>;
  return (
    <div>
      <TableProduct<OrderType> dataProduct={res.items} columns={OrderColumns} paginate={res.meta} />
    </div>
  );
};

export default OrderPage;
