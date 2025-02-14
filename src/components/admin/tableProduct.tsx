'use client';
import { ProductPaginateType, ProductType } from '@/types/indexType';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { PaginationPage } from '../pagination';
import { ChevronDown, MoreHorizontal, Trash } from 'lucide-react';
import FormProduct from './addProduct';
import { productReq } from '@/requestApi/product/productReq';
import { useSession } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type PaginateType = {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};
type TableProductProps<TItem, TProduct extends boolean = false> = {
  dataProduct: TProduct extends true ? ProductType[] : TItem[];
  columns: ColumnDef<TProduct extends true ? ProductType : TItem>[];
  paginate: PaginateType;
  product?: boolean;
  user?: boolean;
};

const TableProduct = <TItem, TProduct extends boolean = false>({
  dataProduct,
  columns,
  paginate,
  product,
  user,
}: TableProductProps<TItem, TProduct>) => {
  const { data: session } = useSession();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [openModal, setOpenModal] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [dataProductEdit, setDataProductEdit] = React.useState<ProductType | null>(null);
  const router = useRouter();
  const totalPage = paginate?.totalPages;
  const page: number = paginate?.currentPage;
  const data: (TProduct extends true ? ProductType : TItem)[] = dataProduct as (TProduct extends true ? ProductType : TItem)[];
  // console.log(dataProduct);
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: paginate?.itemsPerPage || 20,
      },
    },
  });
  const handleOpenModal = async (data: ProductType, accessToken: string) => {
    const res = await productReq.getProduct<ProductType>(data.id, accessToken);
    // console.log('----->',res);
    if (res.id) {
      setOpenEdit(true);
      setDataProductEdit(res);
    } else {
      setOpenEdit(false);
      // setDataProductEdit(null);
      toast({
        title: 'Lỗi',
      });
    }
    // console.log(data);
  };
  const handleDel = async (id: number) => {
    const res = await productReq.deleteProduct<IRes>(id, session.accessToken);
    if (res.statusCode === 200) {
      toast({
        title: 'Xóa thành công',
      });
    } else {
      toast({
        title: Array.isArray(res.error) ? res.error.join(', ') : res.error || 'Lỗi',
        description: res.message || res.error,
      });
    }
  };
  if (!dataProduct) {
    return <div>Không có dữ liệu</div>;
  }
  return (
    <div className="w-full">
      {product && <Button onClick={() => setOpenModal(true)}>Thêm mới</Button>}
      <div className="flex items-center py-4">
        {user ? (
          <Input
            placeholder="Tìm kiếm email ..."
            value={(table?.getColumn('email')?.getFilterValue() as string) ?? ''}
            onChange={event => {
              table.getColumn('email')?.setFilterValue(event.target.value);
            }}
            className="max-w-sm"
          />
        ) : product ? (
          <Input
          placeholder="Tìm kiếm sản phẩm ..."
          value={(table?.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={event => {
            table.getColumn('name')?.setFilterValue(event.target.value);
          }}
          className="max-w-sm"
          />
        ) : (
          <Input
          placeholder="Tìm kiếm theo tên khách ..."
          value={(table?.getColumn('fullName')?.getFilterValue() as string) ?? ''}
          onChange={event => {
            table.getColumn('fullName')?.setFilterValue(event.target.value);
          }}
          className="max-w-sm"
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Cột <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md shadow-md">
        <Table>
          <TableHeader className="bg-gray-200">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} className="text-black text-xl">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
                <TableHead className="text-black text-xl">Hành động</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white text-black ">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>

                        {product ? (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                handleOpenModal(row.original as ProductType, session.accessToken);
                              }}
                            >
                              Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                handleDel((row.original as ProductType).id);
                              }}
                            >
                              xóa <Trash color="red" />
                              {/* <DialogDel id={row.original.id} handleDel={handleDel} /> */}
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => {
                              if (product && (row.original as ProductType).id) {
                                router.push(`/admin/order/${(row.original as ProductType).id}`);
                              }
                            }}
                          >
                            Chi tiết
                            {/* <DialogDel id={row.original.id} handleDel={handleDel} /> */}
                          </DropdownMenuItem>
                        )}

                        {/* <DropdownMenuSeparator /> */}
                        {/* <DropdownMenuItem>
                          // <DialogDel id={row.original.id} handleDel={handleDel} />
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div> */}
      {totalPage > 1 && (
        <div className="sticky bottom-0 float-start z-1 border-t bg-background">
          <PaginationPage totalPage={totalPage} currentPage={page} />
        </div>
      )}
      {openModal && (
        <div>
          <FormProduct isOpen={openModal} setIsOpen={setOpenModal} />
        </div>
      )}
      {openEdit && dataProductEdit && (
        <div>
          <FormProduct isOpen={openEdit} setIsOpen={setOpenEdit} dataProduct={dataProductEdit} />
        </div>
      )}
    </div>
  );
};

export default TableProduct;
