import ProductCom from '@/components/productCom';
import { productReq } from '@/requestApi/product/productReq';
import { ProductType } from '@/types/indexType';
import React from 'react';

const ProductDetail = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;
  const res = await productReq.getProductBySlug<ProductType>(slug);
  if (!res) return <div>loading...</div>;
  return (
    <div>
      <ProductCom product={res} />
    </div>
  );
};

export default ProductDetail;
