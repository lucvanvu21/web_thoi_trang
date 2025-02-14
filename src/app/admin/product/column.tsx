'use client';
import Image from 'next/image';

import { ColumnDef } from '@tanstack/react-table';
import { CategoryType, ProductType, VariantType } from '@/types/indexType';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
export const columns: ColumnDef<ProductType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate') || false}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-black text-xl"
        >
          Sản phẩm
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'images',
    header: () => <div className="text-left">Ảnh</div>,
    cell: ({ row }) => {
      const images = row.getValue('images');
      const firstImage = Array.isArray(images) && images.length > 0 ? images[0].url : null;
      return (
        <div className="lowercase">
          {firstImage ? (
            <Image
              src={firstImage}
              alt="anh-dau-tien"
              width={100}
              height={100}
              style={{
                width: '50px',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          ) : (
            <p>Không có ảnh</p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'variants',
    header: () => <div className="text-left">Kho</div>,
    cell: ({ row }) => {
      const varr: VariantType[] = row.getValue('variants');

      {
        return (
          <div className="flex gap-2">
            {varr?.map((item, index) => (
              <div key={index}>
                <p className="text-sm">
                  {item.quantity} sản phẩm loại {item.id}
                </p>
                {/* <p className="text-sm">{item.color}</p> */}
              </div>
            ))}
          </div>
        );
      }
    },
  },
  {
    accessorKey: 'category',
    header: () => <div className="text-left">Danh mục</div>,
    cell: ({ row }) => {
      const cate: CategoryType = row.getValue('category');

      return <div className="flex gap-2">{cate?.name}</div>;
    },
  },
  {
    accessorKey: 'isActive',
    header: () => <div className="text-left">Trạng thái</div>,
    cell: ({ row }) => {
      const { isActive, isNew, isPopular } = row.original;

      return (
        <div className="flex flex-col gap-2 ">
          {isActive && (
            <div className="p-1 bg-blue-300/75 rounded-md w-fit">
              <p className="text-sm text-blue-600 font-semibold">Đang kinh doanh</p>
            </div>
          )}
          {isPopular && (
            <div className="p-1 bg-blue-300/75 rounded-md w-fit">
              <p className="text-sm text-blue-600 font-semibold">Nổi bật</p>
            </div>
          )}
          {isNew && (
            <div className="p-1 bg-blue-300/75 rounded-md w-fit">
              <p className="text-sm text-blue-600 font-semibold">Mới</p>
            </div>
          )}
        </div>
      );
    },
  },
  // {
  //   accessorKey: 'category',
  //   header: ({ column }) => {
  //     return (
  //       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
  //         Danh mục
  //         <ArrowUpDown />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => <div className="lowercase">{row.getValue('category')}</div>,
  // },
];
