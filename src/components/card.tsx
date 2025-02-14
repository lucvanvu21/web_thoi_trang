'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const CardCom = () => {
  return (
    <>
      <div className="flex flex-col items-center space-y-6 p-6">
      <h1 className="text-2xl font-bold text-red-600">GIỎ HÀNG</h1>
      <p className="text-gray-500">TỔNG SỐ LƯỢNG | 1 SẢN PHẨM</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Danh sách sản phẩm */}
        <Card>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">🛒 Áo Thun Bulldog Blue</p>
                <p className="text-gray-500">Xanh</p>
              </div>
              <p className="font-semibold">300.000 đ</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button>-</Button>
              <p>1</p>
              <Button>+</Button>
            </div>
            <p className="font-semibold">Tổng: 300.000 đ</p>
          </CardContent>
        </Card>
        
        {/* Tổng tiền */}
        <Card>
          <CardContent className="space-y-4">
            <p className="font-semibold">Tổng: 300.000 đ</p>
            <Button className="w-full bg-red-600 text-white">THANH TOÁN NGAY</Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default CardCom;