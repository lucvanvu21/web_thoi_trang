import ListItems from '@/components/listItems';
import SortProduct from '@/components/sort';
import { productReq } from '@/requestApi/product/productReq';
import { ProductPaginateType } from '@/types/indexType';
import React from 'react';

const NewProductPage = async ({
  searchParams,
}: {
  searchParams: {
    sort?: string;
    page?: string;
  };
}) => {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const sort = searchParams.sort ? searchParams.sort : 'moi-nhat';
  // console.log(page, sort);
  const res = await productReq.getByStatus<ProductPaginateType>('new',page,24,sort);
  // console.log(res);
  if (!res?.items || res.items.length === 0) return <div>Không có sản phẩm!</div>;

  return (
    <div>
      <div className="flex justify-between px-2">
        <h1 className="text-3xl font-bold text-black my-5">Sản phẩm mới</h1>
        <SortProduct />
      </div>
      <ListItems data={res} />
    </div>
  );
};

export default NewProductPage;
