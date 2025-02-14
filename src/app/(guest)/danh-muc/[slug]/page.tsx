import ListItems from '@/components/listItems';
import SortProduct from '@/components/sort';
import { productReq } from '@/requestApi/product/productReq';
import { ProductPaginateType } from '@/types/indexType';
import React from 'react';

const CategoryPage = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: {
    sort?: string;
    page?: string;
  };
}) => {
  const slug = params.slug;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const sort = searchParams.sort ? searchParams.sort : 'moi-nhat';
  const res = await productReq.getByCategory<ProductPaginateType>(slug,page,24,sort);
  console.log(res);
  if (!res?.items || res.items.length === 0) return <div>Không có sản phẩm!</div>;

  return (
    <div>
      <div className="flex justify-between px-2">
        <h1 className="text-3xl font-bold text-black my-5">Sản phẩm nổi bật</h1>
        <SortProduct />
      </div>
      <ListItems data={res} />
    </div>
  );
};

export default CategoryPage;
