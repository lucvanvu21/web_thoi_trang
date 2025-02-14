'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Truck, CreditCard, User, Printer, Save } from 'lucide-react';
import Image from 'next/image';

import { OrderType } from '@/types/indexType';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { orderStatus } from '@/app/admin/order/orderColumn';
import { useState } from 'react';
import { orderReq } from '@/requestApi/order/orderReq';
import { useSession } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';
import { OrderStatusType } from '@/types/orderStatusSchema';
import { updateStatus } from '@/requestApi/order/orderR';

// console.log(params.id);
const list = [
  {
    value: 'processing',
    label: 'Đang xử lý',
  },
  {
    value: 'delivering',
    label: 'Đang vận chuyển',
  },
  {
    value: 'delivered',
    label: 'Đã giao hàng',
  },
  {
    value: 'refund',
    label: 'Hoàn tiền',
  },
  {
    value: 'return',
    label: 'Trả lại',
  },
  {
    value: 'cancel',
    label: 'Hủy',
  },
];

const OrderDetail = ({ data }: { data: OrderType }) => {
  const { data: session } = useSession();
  // console.log('data', session);
  const [loading, setLoading] = useState(null);
  const [status, setStatus] = useState<OrderStatusType>({
    orderStatus: data.orderStatus as 'processing' | 'delivering' | 'delivered' | 'refund' | 'return' | 'cancel',
    isPaid: data.isPaid,
    paidDate: data.paidDate,
  });
  const date = new Date(data.createdDate).toLocaleDateString('vi-VN');

  const handleChange1 = (value: string) => {
    setStatus({
      orderStatus: value as 'processing' | 'delivering' | 'delivered' | 'refund' | 'return' | 'cancel',
      isPaid: value === 'delivered' ? true : false,
      paidDate: value === 'delivered' ? new Date().toISOString() : null,
    });
  };
  const handleUpdateStatus = async (caseStatus: number) => {
    // console.log('update status', status);
    if (caseStatus === 1) {
      // console.log('update----', caseStatus);
      // console.log('status----', status);
      setLoading(1);
      // const res = await orderReq.updateStatus<IRes>(data.id, status, session?.accessToken);
      const res = await updateStatus(data.id, status, session?.accessToken);
      // console.log('res', res);
      if (res?.statusCode === 200) {
        toast({
          title: 'Cập nhật thành công',
        });
        setLoading(null);
      } else {
        toast({
          title: 'Cập nhật thất bại',
          description: res?.message || res?.error || 'Cập nhật thất bại',
        });
        setLoading(null);
      }
      // console.log('update status', res);
    } else {
      setLoading(2);
      const status: OrderStatusType = {
        orderStatus: 'delivered',
        isPaid: true,
        paidDate: new Date().toISOString(),
      };
      const res = await updateStatus(data.id, status, session?.accessToken);
      if (res?.statusCode === 200) {
        toast({
          title: 'Cập nhật thành công',
        });
        setLoading(null);
      } else {
        toast({
          title: 'Cập nhật thất bại',
          description: res?.message || res?.error || 'Cập nhật thất bại',
        });
        setLoading(null);
      }
    }
  };
  // return
  // console.log('data', data.orderStatus);
  return (
    <div>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Chi tiết đơn hàng</CardTitle>
            <p className="text-sm text-gray-500">Mã đơn hàng: {data.id}</p>
            <p className="text-sm text-gray-500">Ngày đặt: {date}</p>
          </div>
          <div className="flex justify-center items-center gap-2">
            <Select
              onValueChange={value => {
                // console.log(value);
                handleChange1(value);
              }}
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder={orderStatus(data.orderStatus)} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {list.map(item => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {loading === 1 ? (
              <div>Loading</div>
            ) : (
              <Button variant="outline" onClick={() => handleUpdateStatus(1)}>
                <Save className="w-5 h-5" color="red" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <User className="text-red-500" />
              <div>
                <p className="font-medium">Khách hàng</p>
                <p className="text-sm">{data.fullName}</p>
                <p className="text-sm text-gray-500">{data.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="text-red-500" />
              <div>
                <p className="font-medium">Phương thức thanh toán</p>
                <p className="text-sm uppercase">{data?.paymentMethod}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="text-red-500" />
              <div>
                <p className="font-medium">Giao hàng đến</p>
                <p className="text-sm">{data?.address}</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Đơn giá</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Tổng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Image src={data.orderItems[0].variant.product.images[0].url} alt="anh1" width={30} height={50} />
                      <div>
                        <p>{data.orderItems[0].variant.product.name}</p>
                        <p className="text-sm text-gray-500">Size: {data.orderItems[0].variant.attributeValues[0].value}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{data.orderItems[0].variant.price} đ</TableCell>
                  <TableCell>{data.orderItems[0].orderedQuantity}</TableCell>
                  <TableCell>{data.orderItems[0].orderedPrice} đ</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between mt-6">
            <div>
              <p>
                Phí ship: <span className="font-medium">0 đ</span>
              </p>
              <p className="text-lg font-bold">Tổng: {data.orderItems[0].orderedPrice} đ</p>
              <Badge variant={data?.isPaid ? 'success' : 'error'}>{data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</Badge>
            </div>
            <div className="flex gap-2">
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => handleUpdateStatus(2)}
                disabled={loading === 2 ? true : false}
              >
                Đánh dấu đã giao hàng
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetail;
