import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { orderReq } from '@/requestApi/order/orderReq';
import { OrderType } from '@/types/indexType';
import OrderDetail from '@/components/admin/orderDetail';

export default async function OrderDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const token = await getServerSession(authOptions);
  const res = await orderReq.getOne<OrderType>(id, token.accessToken);
  // console.log('--------> order ------>', res);
  if (!res.id) return <div>Không có dữ liệu</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <OrderDetail data={res} />
    </div>
  );
}
