import TableProduct from '@/components/admin/tableProduct';
import { productReq } from '@/requestApi/product/productReq';
import { ProductPaginateType, ProductType } from '@/types/indexType';
import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import React from 'react';
import { columns } from './column';

const Product = async ({searchParams}:{searchParams:{page: number}}) => {
  const token = await getServerSession(authOptions);
  const page = searchParams.page || 1
  const res = await productReq.getAll<ProductPaginateType>(token.accessToken,page,25);
  if (!res.items) return <div>Loading...</div>;
  return (
    <>
      <TableProduct<ProductType> dataProduct={res.items} columns={columns} paginate={res.meta} product={true}/>
    </>
  );
};

export default Product;
