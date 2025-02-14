'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Image from 'next/image';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useCartStore } from '@/app/store/cartStore';
import { CityType, DistrictType, OrderType, UserType, VariantType, WardType } from '@/types/indexType';
import { orderReq } from '@/requestApi/order/orderReq';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
export const formSchema = z.object({
  fullName: z.string(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  note: z.string().optional(),
  district: z.string(),
  ward: z.string(),
  paymentMethod: z.string(), // Đảm bảo paymentMethod được định nghĩa
});
const totalPrice = (cart: any[]) => cart.reduce((sum, i) => sum + i.price * i.amountInCart, 0);

const CheckoutCom = ({ cities, user }: { cities: CityType[]; user?: UserType }) => {
  const { data: session } = useSession();
  const router = useRouter();
  // console.log('cities', cities);
  // return <>okok</>
  const { cart, clearCart } = useCartStore();
  const [shippingFee, setShippingFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [data, setData] = useState<VariantType[]>([]);
  const [districts, setDistricts] = useState<DistrictType[]>([]);
  const [wards, setWards] = useState<WardType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const ids = cart.map(i => i.variantId);
  const prevIdsRef = useRef([]);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || undefined,
      address: user?.address || '',
      city: '',
      note: '',
      district: '',
      ward: '',
      paymentMethod: 'COD',
    },
  });
  useEffect(() => {
    // Giả lập tính phí vận chuyển (có thể thay đổi theo địa chỉ)
    setShippingFee(cart.length > 0 ? 0 : 0);
  }, [cart]);
  useEffect(() => {
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

  const citiesOption = cities
    ?.map(c => ({
      value: c.code,
      label: c.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const wardsOption = wards?.map(c => ({
    value: c.code,
    label: c.name,
  }));

  const districtsOption = districts?.map(c => ({
    value: c.code,
    label: c.name,
  }));

  const handleChangeCity = async (onChange: (...event: any[]) => void, e: any) => {
    try {
      onChange(e);
      // console.log('e', e);
      const res = await fetch('https://provinces.open-api.vn/api/p/' + e + '?depth=2', {
        cache: 'force-cache',
      }).then(res => res.json());
      // console.log('res change city', res);
      form.setValue('district', null);
      setDistricts(res.districts);
      form.setValue('ward', null);
      setWards([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeDistrict = async (onChange: (...event: any[]) => void, e: any) => {
    try {
      onChange(e);
      const res = await fetch('https://provinces.open-api.vn/api/d/' + e + '?depth=2', {
        cache: 'force-cache',
      }).then(res => res.json());
      setWards(res.wards);
      form.setValue('ward', null);
    } catch (error) {
      console.log(error);
    }
  };
  const onSubmit = async data => {
    // console.log('data----->submit', data);
    const PhoneNumber = Number(data.phone);
    if (isNaN(PhoneNumber)) {
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Số điện thoại phải là số',
      });
      return;
    }
    const { city, district, ward, ...restData } = data;
    const tp = citiesOption.find(c => c.value === Number(city)).label;
    const quan = districtsOption.find(c => c.value === Number(district)).label;
    const xa = wardsOption.find(c => c.value === Number(ward)).label;
    const address = data.address + '. ' + xa + ', ' + quan + ', ' + tp;
    // console.log('address', address);
    const orderItems = cartItems.map(c => ({
      variantId: c.id,
      orderedPrice: c.price,
      orderedQuantity: c.amountInCart,
    }));

    const postData = {
      ...restData,
      address,
      phone: PhoneNumber,
      shippingCost: 0,
      totalPrice: totalPrice(cartItems),
      orderItems,
      user: session
        ? {
            id: session?.id,
          }
        : null,
    };

    try {
      setIsLoading(true);

      const res = await orderReq.create<OrderType>(postData);

      console.log('res order', res);
      if (res.id) {
        toast({
          title: 'Tạo đơn hàng thành công',
          // description: 'Tạo thành công',
        });
        clearCart();
        router.replace(`/chi-tiet-don-hang/${res.id}`);
      } else {
        toast({
          title: 'Có lỗi xảy ra',
          description: 'Có lỗi xảy ra',
        });
      }
      // if(res)
      // Swal.fire({
      //   title: 'Tạo thành công!',
      //   icon: 'success',
      // }).then(async () => {
      //   router.replace(`/order/${res.data.id}`);
      // });

      // dispatch(clearCart());
      // methods.reset();
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        toast({
          title: 'Có lỗi xảy ra',
          description: error.response.data.message || 'Có lỗi',
        });
        return;
      }
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Có lỗi',
      });
    } finally {
      setIsLoading(false);
    }
  };
  // const totalAmount = {cart.reduce((sum, i) => sum + i.price * i.amountInCart, 0).toLocaleString('vi-VN')} đ

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <h1 className="text-2xl font-bold text-red-600">THANH TOÁN</h1>

      {/* Thông tin đặt hàng */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(values => onSubmit(values))} className="space-y-6 sm:space-y-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full ">
            <Card className="h-fit shadow-lg">
              <CardHeader>
                <CardTitle className="text-red-600">1. Thông tin đặt hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Họ và tên" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="Điện thoại" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input placeholder="Địa chỉ" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex w-full justify-between gap-2">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="w-[50%]">
                        <FormLabel>Tỉnh / Thành phố</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={value => {
                              field.onChange(value);
                              handleChangeCity(field.onChange, value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={'Chọn tỉnh'} />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.isArray(citiesOption) &&
                                citiesOption.length > 0 &&
                                citiesOption?.map(cate => (
                                  <SelectItem key={cate.value} value={cate.value.toString()}>
                                    {cate.label}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem className="w-[50%]">
                        <FormLabel>Quận / Huyện</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={value => {
                              field.onChange(value);
                              handleChangeDistrict(field.onChange, value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={'Chọn huyện'} />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.isArray(districtsOption) &&
                                districtsOption.length > 0 &&
                                districtsOption?.map(cate => (
                                  <SelectItem key={cate.value} value={cate.value.toString()}>
                                    {cate.label}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="ward"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Xã / Phường</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={value => {
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={'Chọn Xã'} />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.isArray(wardsOption) &&
                              wardsOption.length > 0 &&
                              wardsOption?.map(cate => (
                                <SelectItem key={cate.value} value={cate.value.toString()}>
                                  {cate.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Ghi chú đơn hàng</FormLabel>
                      <FormControl>
                        <Input placeholder="Ghi chú đơn hàng" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="h-fit shadow-lg">
              <CardHeader>
                <CardTitle className="text-red-600">2. Phương thức thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Danh mục</FormLabel> */}
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="COD" id="r1" />
                            <Label htmlFor="r1">Thanh toán khi nhận hàng (COD)</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card className="h-fit shadow-lg">
              <CardHeader>
                <CardTitle className="text-red-600">3. Thông tin giỏ hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {cartItems.length > 0 ? (
                  cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-2 border-b pb-2">
                      <Image src={item?.product?.images[0]?.url} alt={item.product?.name} height={40} width={30} />
                      <p>
                        {item.product?.name} - {item.quantity} x {item.price.toLocaleString()} đ
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Không có sản phẩm trong giỏ hàng</p>
                )}
                <hr />
                <p>
                  <strong>Tổng:</strong> {cartItems.reduce((sum, i) => sum + i.price * i.amountInCart, 0).toLocaleString('vi-VN')}{' '}
                  đ
                </p>
                <p>
                  <strong>Phí vận chuyển:</strong> {shippingFee.toLocaleString()} đ
                </p>
                <p>
                  <strong>Giảm:</strong> {discount.toLocaleString()} đ
                </p>
                <hr />
                <p className="text-red-600 font-bold">
                  Cần thanh toán:
                  {(totalPrice(cartItems) + shippingFee).toLocaleString('vi-VN')} đ
                </p>
                <Button className="w-full" disabled={cartItems.length === 0} type="submit">
                  Đặt hàng
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>

      {/* Phương thức thanh toán */}

      {/* Thông tin giỏ hàng */}
    </div>
  );
};

export default CheckoutCom;
