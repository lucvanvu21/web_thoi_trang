import ListItems from '@/components/listItems';
import SortProduct from '@/components/sort';
import { productReq } from '@/requestApi/product/productReq';
import { ProductPaginateType } from '@/types/indexType';

const PriceSale = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page: string; sort: string };
}) => {
  const page = searchParams.page ? parseInt(searchParams.page.toString()) : 1;
  const sort = searchParams.sort ? searchParams.sort : 'moi-nhat';
  const price = parseInt(params.slug.replace('k', ''), 10) * 1000;
  const res = await productReq.getByPrice<ProductPaginateType>(page, sort, price);
  // console.log(price);
  if (!res?.items || res.items.length === 0) return <div>Không có sản phẩm!</div>;

  return (
    <div>
      <div className="flex justify-between px-2">
        <h1 className="text-3xl font-bold text-black my-5">Sản phẩm giá {params?.slug}</h1>
        <SortProduct />
      </div>
      <ListItems data={res} />
    </div>
  );
};

export default PriceSale;
