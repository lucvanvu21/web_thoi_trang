import { orderReq } from '@/requestApi/order/orderReq';
import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderType } from '@/types/indexType';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const OrderPage = async ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const token = await getServerSession(authOptions);
  const body = {
    userId: token?.id,
    orderId: id,
  };
  const res = await orderReq.getOrderDetail<OrderType>(body, token?.accessToken);
  // console.log('order------>',res);
  if (!res.id) return <div className="mt-52 text-center">Đơn hàng không tồn tại</div>;
  return (
    <div>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-center">CHI TIẾT ĐƠN HÀNG</h1>
        {res?.isPaid ? (
          <div className="bg-green-200 text-center text-green-600 p-2 rounded mt-4">Đã thanh toán</div>
        ) : (
          <div className="bg-red-200 text-center text-red-800 p-2 rounded mt-4">Đơn hàng chưa thanh toán</div>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Trạng thái đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center text-gray-600 text-sm">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">✓</div>
                <span>Đã đặt</span>
              </div>
              <Separator className={cn('w-10 md:w-16', 'bg-blue-500')} />
              <div className="flex flex-col items-center justify-center">
                {res?.orderStatus === 'processing' || res?.orderStatus === 'delivering' || res?.orderStatus === 'delivered' ? (
                  <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">✓</div>
                ) : (
                  <div className="w-8 h-8 bg-gray-300 text-white flex items-center justify-center rounded-full">2</div>
                )}

                <span>Đang xử lý</span>
              </div>
              <Separator
                className={cn(
                  'w-10 md:w-16',
                  res?.orderStatus === 'delivering' || res?.orderStatus === 'delivered' ? 'bg-blue-500' : 'bg-gray-300'
                )}
              />
              <div className="flex flex-col items-center">
                {res?.orderStatus === 'delivering' || res?.orderStatus === 'delivered' ? (
                  <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">✓</div>
                ) : (
                  <div className="w-8 h-8 bg-gray-300 text-white flex items-center justify-center rounded-full">3</div>
                )}
                <span>Vận chuyển</span>
              </div>
              <Separator className={cn('w-10 md:w-16', res?.orderStatus === 'delivered' ? 'bg-blue-500' : 'bg-gray-300')} />
              <div className="flex flex-col items-center">
                {res?.orderStatus === 'delivered' ? (
                  <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">✓</div>
                ) : (
                  <div className="w-8 h-8 bg-gray-300 text-white flex items-center justify-center rounded-full">4</div>
                )}
                <span>Đã giao</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-blue-700">Thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Mã đơn hàng:</strong> {res?.id}
            </p>
            <p>
              <strong>Ngày đặt:</strong> {new Date(res?.createdDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Người nhận:</strong> {res?.fullName}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {res?.phone}
            </p>
            <p>
              <strong>Giao đến:</strong> {res?.address}
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong> {res?.paymentMethod}
            </p>
            <div className="flex">
              <strong>Trạng thái thanh toán:</strong>
              {res?.isPaid ? <Badge variant="success">Đã thanh toán</Badge> : <Badge variant="error">Chưa thanh toán</Badge>}
            </div>
            <p>
              <strong>Tổng tiền:</strong>{' '}
              <span className="text-red-600 font-bold">{res?.totalPrice.toLocaleString('vi-VN')} đ</span>
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-blue-700">Thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {res?.orderItems.map(item => (
              <>
                <div className='md:flex items-center gap-2'>
                  <Image
                    src={item.variant.product && item.variant.product.images.length > 0 ? item.variant.product.images[0].url : ''}
                    alt="anh"
                    height={50}
                    width={40}
                  />
                  <div className='flex gap-2'>
                    <p>{item?.variant.product?.name}</p>
                    <div className='flex items-center  text-gray-500'>
                      {item.variant.attributeValues.length > 0 &&
                        item.variant.attributeValues.map((i, index) => (
                          <p key={i.id + i.value}>{(index ? ', ' : '') + i.value}</p>
                        ))}
                    </div>
                  </div>
                </div>
                <p>
                  <strong>Tổng tiền:</strong> <span className="text-red-600 font-bold">{item.orderedPrice.toLocaleString('vi-VN')} đ</span>
                </p>
              </>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderPage;
