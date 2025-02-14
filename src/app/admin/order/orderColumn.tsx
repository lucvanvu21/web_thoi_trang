'use client';
import { ColumnDef } from '@tanstack/react-table';
import { OrderType } from '@/types/indexType';
import { Badge } from '@/components/ui/badge';

export const orderStatus = (status: string) => {
  if (status === 'processing') return 'đang xử lý';
  if (status === 'delivering') return 'đang vận chuyển';
  if (status === 'delivered') return 'đã giao hàng';
  if (status === 'refund') return 'hoàn tiền';
  if (status === 'return') return 'trả lại';
  return 'hủy';
};
export const orderStatusColor = (status: string) => {
  if (status === 'processing') return 'warning';
  if (status === 'delivering') return 'primary';
  if (status === 'delivered') return 'success';
  if (status === 'return') return 'error';
  return 'primary';
};
export const OrderColumns: ColumnDef<OrderType>[] = [
  {
    accessorKey: 'id',
    header: () => <div className="text-left">Mã đơn</div>,
    cell: ({ row }) => <div className="lowercase">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'fullName',
    header: () => <div className="text-left">Khách hàng</div>,
    cell: ({ row }) => <div className="lowercase">{row.getValue('fullName')}</div>,
  },
  {
    accessorKey: 'user',
    header: () => <div className="text-left">Tài khoản</div>,
    cell: ({ row }) => {
      const user = row.getValue('user') as { email: string };
      // console.log('user------->',row)
      const email = user?.email || 'Khách';
      return <div className="lowercase">{email}</div>;
    },
  },
  // {
  //   accessorKey: 'orderItems',
  //   header: () => <div className="text-left">Mặt hàng</div>,
  //   cell: ({ row }) => <div className="lowercase">{row.getValue('orderItems')}</div>,
  // },
  {
    accessorKey: 'totalPrice',
    header: () => <div className="text-left">Giá</div>,
    cell: ({ row }) => <div className="lowercase">{row.getValue('totalPrice').toLocaleString()}</div>,
  },
  {
    accessorKey: 'paymentMethod',
    header: () => <div className="text-left">Phương thức</div>,
    cell: ({ row }) => <div className="uppercase">{row.getValue('paymentMethod')}</div>,
  },
  {
    accessorKey: 'isPaid',
    header: () => <div className="text-left">Thanh toán</div>,
    cell: ({ row }) => {
      const isPaid = row.getValue('isPaid');
      return (
        <div
          className={`lowercase ${
            isPaid ? 'text-green-500 border border-green-500 w-fit p-1' : 'text-red-500 border border-red-500 w-fit p-1'
          }`}
        >
          {isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </div>
      );
    },
  },
  {
    accessorKey: 'orderStatus',
    header: () => <div className="text-left">Trạng thái</div>,
    cell: ({ row }) => {
      const status = orderStatus(row.getValue('orderStatus'));
      const color = orderStatusColor(row.getValue('orderStatus'));
      return <Badge variant={color}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'createdDate',
    header: () => <div className="text-left">Ngày đặt</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdDate')).toLocaleDateString('vi-VN');
      // console.log(date);
      return <div className="lowercase">{date}</div>;
    },
  },
];
