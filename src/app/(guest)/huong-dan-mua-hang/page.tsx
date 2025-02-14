import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const steps = [
  {
    title: 'Bước 1: Truy cập website và lựa chọn sản phẩm cần mua',
    content: 'Truy cập website và lựa chọn sản phẩm cần mua để mua hàng.',
  },
  {
    title: 'Bước 2: Thêm sản phẩm vào giỏ hàng',
    content: `Click vào sản phẩm muốn mua, màn hình sẽ hiển thị lựa chọn các thông tin hàng bạn muốn đặt.
    Nếu bạn muốn  mua hàng: Bấm vào lựa chọn thêm sản phẩm vào giỏ hàng.Vào trang giỏ hàng sẽ có lựa chọn thanh toán 
   Nếu bạn muốn đặt hàng và thanh toán cho sản phẩm này vui lòng bấm vào: Đặt hàng và thanh toán.`,
  },

  {
    title: 'Bước 3: Điền thông tin nhận hàng và chọn phương thức thanh toán',
    content: 'Điền các thông tin của bạn để nhận đơn hàng, lựa chọn hình thức thanh toán và vận chuyển cho đơn hàng của mình.',
  },
  {
    title: 'Bước 4: Kiểm tra lại đơn hàng và hoàn tất',
    content: `Xem lại thông tin đặt hàng, điền chú thích và gửi đơn hàng. Sau khi nhận được đơn hàng chúng tôi sẽ liên hệ lại để xác nhận.`,
  },
];

export default function ShoppingGuide() {
  return (
    <Card className="max-w-2xl mx-auto my-8 p-6 shadow-md rounded-xl">
      <CardContent>
        <h2 className="text-2xl font-semibold mb-4">Hướng Dẫn Mua Hàng</h2>
        <Separator className="mb-4 bg-gray-300" />
        <div>
          {steps.map((step, index) => (
            <div key={index}>
              <h3 className="font-medium text-xl mt-2">{step.title}</h3>
              <p className="text-lg text-gray-600 mb-2">{step.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
