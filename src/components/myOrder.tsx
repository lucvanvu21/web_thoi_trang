'use client';
import Link from 'next/link';
import { OrderPaginateType } from '@/types/indexType';
import { PaginationPage } from './pagination';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
const MyOrder2 = ({ res }: { res: OrderPaginateType }) => {
  console.log('res', res);
  return (
    <div>
      {res.meta.totalItems > 0 ? (
        <div className="flex flex-col gap-4 justify-center items-center w-full">
          {Array.isArray(res?.items) &&
            res?.items.map(item => {
              return (
                <div key={item.id} className="border w-full p-2 px-4">
                  <div>
                    <div className="text-lg font-semibold"># Đơn hàng {item?.id}</div>
                    <div className="md:text-lg font-semibold">
                      {item.orderItems.map(o => (
                        <div key={`item ${o.id}`} className=" md:flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-2">
                            <Image
                              src={
                                o.variant.product && o.variant.product.images.length > 0 ? o.variant.product.images[0].url : ''
                              }
                              alt="anh"
                              height={50}
                              width={40}
                            />
                            <div>
                              <h3> {o.variant.product?.name}</h3>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center ">
                                  {o.variant.attributeValues?.length > 0 &&
                                    o.variant.attributeValues.map((i, index) => (
                                      <p key={i.id + i.value} className="text-sm text-gray-500">
                                        {(index === 0 ? '  ' : ', ') + i.value}
                                      </p>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500"> Số lượng : {o.orderedQuantity}</p>
                              </div>
                            </div>
                          </div>
                          {/* <div>
                            <p>{o.orderedPrice.toLocaleString('vi-VN')} đ</p>
                          </div> */}
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-400">{new Date(item.createdDate).toLocaleString('vi-VN')}</p>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-red-700">{item.totalPrice.toLocaleString('vi-VN')} đ</p>
                      </div>
                      <Link href={'/chi-tiet-don-hang/' + item?.id}>
                        <Button>Chi tiết</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center my-5 text-red-500 text-xl">Không có đơn hàng nào</div>
      )}
      <div>
        {res?.meta?.totalPages > 1 && <PaginationPage totalPage={res?.meta?.totalPages} currentPage={res?.meta?.currentPage} />}
      </div>
    </div>
  );
};
const MyOrder = ({ res, type }: { res: OrderPaginateType; type?: string }) => {
  const router = useRouter();

  const tabs = [
    { id: 1, name: 'Tất cả', value: 'tat-ca' },
    { id: 2, name: 'Đang xử lý', value: 'dang-xu-ly' },
    { id: 3, name: 'Đang vận chuyển', value: 'dang-van-chuyen' },
    { id: 4, name: 'Đã giao hàng', value: 'da-giao-hang' },
    { id: 5, name: 'Đã hủy', value: 'da-huy' },
    { id: 6, name: 'Trả hàng', value: 'tra-hang' },
    { id: 7, name: 'Hoàn tiền', value: 'hoan-tien' },
  ];
  const typeFromURL = type || 'tat-ca';
  return (
    <Tabs defaultValue={typeFromURL} className="md:w-[75%] ">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 h-fit bg-white text-black">
        {tabs.map(item => {
          return (
            <TabsTrigger key={item.id} value={item.value} onClick={() => router.push(`?type=${item.value}`)}>
              {item.name}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {tabs.map(item => (
        <TabsContent key={item.id} value={item.value} className="mt-6">
          <MyOrder2 res={res} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default MyOrder;
