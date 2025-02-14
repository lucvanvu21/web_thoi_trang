import { orderReq } from '@/requestApi/order/orderReq';
import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import { OrderPaginateType } from '@/types/indexType';
import MyOrder from '@/components/myOrder';

const MyOrderPage = async ({ searchParams }: { searchParams: { page: number; type: string } }) => {
  const token = await getServerSession(authOptions);
  console.log('token', token);
  const body = {
    userId: token?.id,
  };
  const page = searchParams?.page || 1;
  let type;
  if (searchParams?.type === 'tat-ca') {
    type = undefined;
  } else if (searchParams?.type == 'dang-xu-ly') {
    type = 1;
  } else if (searchParams?.type == 'dang-van-chuyen') {
    type = 2;
  } else if (searchParams?.type == 'da-giao-hang') {
    type = 3;
  } else if (searchParams?.type == 'da-huy') {
    type = 4;
  } else if (searchParams?.type == 'tra-hang') {
    type = 5;
  } else if (searchParams?.type == 'hoan-tien') {
    type = 6;
  } else {
    type = undefined;
  }

  const res = await orderReq.getMyOrder<OrderPaginateType>(body, token?.accessToken, page, type);
  // console.log('------>res', res);
  if ('error' in res) return <div className="mt-52 text-center">Đơn hàng không tồn tại</div>;
  return (
    <div className="container mx-auto mt-20 flex flex-col gap-3 justify-center items-center p-2">
      <h1 className="text-4xl font-semibold">Đơn hàng của tôi</h1>
      <MyOrder res={res} type={searchParams?.type}/>
    </div>
  );
};

export default MyOrderPage;
