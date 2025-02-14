import ListItems from '@/components/listItems';
import { productReq } from '@/requestApi/product/productReq';
import { ProductPaginateType } from '@/types/indexType';
import React from 'react';

const SearchPage = async ({ searchParams }: { searchParams: { query: string; page: number } }) => {
  const q = searchParams.query;
  const page = searchParams.page || 1;
  const res = await productReq.getAllOrSearch<ProductPaginateType>(page, 24, q);
  if (res?.error || !res?.items || res.items.length === 0 ) return <div>Không có sản phẩm!</div>;
  return (
    <div>
      <h2 className='my-5 text-2xl font-semibold'>Tìm kiếm cho {q}</h2>
      <ListItems data={res} />
    </div>
  );
};

export default SearchPage;
