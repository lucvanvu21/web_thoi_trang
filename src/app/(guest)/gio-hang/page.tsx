'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCartStore } from '@/app/store/cartStore';
import { Minus, Plus, Trash } from 'lucide-react';
import { orderReq } from '@/requestApi/order/orderReq';
import { VariantType } from '@/types/indexType';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// const fetcher = (url, ids) => axios.post(url, ids).then(res => res.data);

// export const useCheckVariantIds = (ids) => {
//   const { data } = useSWR(ids.length ? [`${process.env.NEXT_PUBLIC_API_URL}/variant/active`, ids] : null, fetcher);
//   return { data };
// };

export default function Cart() {
  const router = useRouter();
  const { cart, totalAmount, increaseAmount, decreaseAmount, removeItemFromCart, updateCart } = useCartStore();

  const [data, setData] = useState<VariantType[]>([]);
  const ids = cart.map(i => i.variantId);
  // const { data } = useCheckVariantIds(ids);
  const prevIdsRef = useRef([]);

  useEffect(() => {
    // console.log('ids', ids);
    if (ids.length === 0) return;

    // Kiểm tra nếu ids không thay đổi thì không gọi fetcher
    if (JSON.stringify(prevIdsRef.current) === JSON.stringify(ids)) return;

    const fetcher = async () => {
      const res = await orderReq.postVar<VariantType[]>(ids);
      setData(res);
    };

    fetcher();

    // Cập nhật giá trị trước đó của ids
    prevIdsRef.current = ids;
  }, [ids]);

  const cartItems = useMemo(() => {
    return data?.map(d => ({ ...d, amountInCart: cart.find(c => c.variantId === d.id)?.quantity || 0 })) || [];
  }, [data, cart]);

  useEffect(() => {
    if (data.length > 0) {
      updateCart(data.map(i => i.id));
    }
  }, [data]);

  const handlePay = () => {
    router.push('/thanh-toan');
  };
  console.log('cartItems', cartItems);
  const removeItem = id => {
    removeItemFromCart(id);
  };
  // console.log('cartItems', cartItems);
  // console.log('data', data);

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold text-center text-red-600">GIỎ HÀNG</h2>
      <p className="text-center text-lg">Tổng số lượng: {totalAmount} sản phẩm</p>

      <div className="md:flex gap-6 mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Đơn giá</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Tổng</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(cartItems) &&
              cartItems.map(item => (
                <TableRow key={item.id} className="hover:bg-transparent">
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {/* <Image src={item?.price} /> */}
                      <div>
                        <Image src={item?.product?.images[0].url} alt="anh1" height={50} width={40} />{' '}
                      </div>
                      <div>
                        <h3>{item.product?.name}</h3>
                        <p className="flex items-center">
                          {item.attributeValues.length > 0 &&
                            item.attributeValues.map((i, index) => (
                              <p key={i.id + i.value} className="text-gray-500 text-sm">
                                {(index ? ', ' : '') + i.value}
                              </p>
                            ))}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.price.toLocaleString('vi-VN')} đ</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 h-full">
                      <button onClick={() => decreaseAmount(item.id)} className="border p-1">
                        <Minus size={20} />
                      </button>
                      <span>{item.amountInCart}</span>
                      <button onClick={() => increaseAmount(item.id)} className="border p-1">
                        <Plus size={20} />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>{(item.price * item.amountInCart).toLocaleString('vi-VN')} đ</TableCell>
                  <TableCell>
                    <button onClick={() => removeItem(item.id)} className="text-red-600">
                      <Trash size={20} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <Card className="mt-5 p-4">
          <CardContent>
            <p className="text-lg font-bold">
              Tổng: {cartItems.reduce((sum, i) => sum + i.price * i.amountInCart, 0).toLocaleString('vi-VN')} đ
            </p>
            <Button className="mt-3 w-full" onClick={handlePay}>
              THANH TOÁN NGAY
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
