import { CarouselTop } from '@/components/carousel';
import FooterC from '@/components/layout/footer';
import Header from '@/components/layout/header';
import ListItems from '@/components/listItems';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { productReq } from '@/requestApi/product/productReq';
import { ProductPaginateType } from '@/types/indexType';
import { ChevronRight } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
export const metadata: Metadata = {
  robots: 'INDEX,FOLLOW',
};
export default async function Home() {
  // console.log(newProduct);
  const newProduct = await productReq.getByStatus<ProductPaginateType>('new', 1, 12, 'moi-nhat');
  const hotProduct = await productReq.getByStatus<ProductPaginateType>('popular', 1, 12, 'moi-nhat');
  const hot = [
    {
      name: 4,
      src: 'https://theme.hstatic.net/1000026602/1001301647/14/slideshow_1.jpg?v=422',
    },
    {
      name: 1,
      src: 'https://theme.hstatic.net/1000026602/1001301647/14/slideshow_2.jpg?v=231',
    },
    {
      name: 0,
      src: 'https://theme.hstatic.net/1000026602/1001301647/14/img-banner-index.jpg?v=231',
    },
    {
      name: 2,
      src: 'https://theme.hstatic.net/1000026602/1001301647/14/slideshow_3.jpg?v=231',
    },
    {
      name: 3,
      src: 'https://theme.hstatic.net/1000026602/1001301647/14/slideshow_1.jpg?v=231',
    },
  ];
  const prices = ['99K', '149K', '199K', '249K', '299K', '349K'];
  const products = [
    {
      id: 1,
      name: 'Sơ Mi',
      image: 'https://product.hstatic.net/1000026602/product/sanee_29-1022433_7ccdbe2612b34008aee69eccb7e39617_master.jpg',
      slug: 'ao-so-mi',
    },
    {
      id: 2,
      name: 'Quần Jean',
      image: 'https://product.hstatic.net/1000026602/product/sanee_29-1023210_c948587bd8fa4b799f81307818370180_master.jpg',
      slug: 'quan-jean',
    },
    {
      id: 3,
      name: 'Áo Thun',
      image: 'https://product.hstatic.net/1000026602/product/sanee_29-1022159_8a32a97d30b54454a7b7030dbbec7905_master.jpg',
      slug: 'ao-thun',
    },
    {
      id: 4,
      name: 'Quần Âu',
      image: 'https://product.hstatic.net/1000026602/product/sanee_29-1021809_d83c9711ea864b42ae37df5270c30ae8_master.jpg',
      slug: 'quan-au',
    },
  ];

  return (
    <>
      <Header top={true} />
      <div>
        <section>
          <CarouselTop data={hot} />
        </section>
        <div className="container mx-auto px-2 md:px-24">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 md:mx-20 gap-6 my-6">
            {prices.map((price, index) => (
              <Link href={'/gia-ban/' + price} key={index} className="flex flex-col items-center justify-between space-y-2">
                <div className="w-20 h-20 flex items-center justify-center bg-[#c0261a] rounded-full">
                  <span className="text-white text-2xl font-bold hover:text-primary">{price}</span>
                </div>
                <div className="text-black font-semibold hover:text-primary">{price}</div>
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {products.map(product => (
              <Link key={product.id} href={'/danh-muc/' + product?.slug}>
                <Card
                  key={product.id}
                  className="overflow-hidden hover:-translate-y-1 hover:shadow-xl duration-300 ease-in-out border-gray-400"
                >
                  <Image src={product.image} alt={product.name} width={300} height={500} className="object-cover w-full h-auto" />
                  <div className="text-center text-lg font-medium py-2 hover:text-primary">{product.name}</div>
                </Card>
              </Link>
            ))}
          </div>
          <div className="w-full">
            <div className=" py-4">
              <div className="flex items-center">
                <h2 className="text-xl lg:text-3xl font-semibold my-4 text-black">Sản phẩm mới</h2>
                <Link href="/san-pham-moi">
                  <div className="flex items-center group relative overflow-hidden ml-4 cursor-pointer pr-24">
                    <h3 className="text-sm absolute left-0 opacity-0 -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap group-hover:text-red-500">
                      Xem thêm
                    </h3>
                    <ChevronRight
                      className="transition-transform duration-300 group-hover:translate-x-[calc(100%+3rem)] group-hover:text-red-500" // Thay đổi ở đây
                      size={20}
                    />
                  </div>
                </Link>
              </div>
            </div>
            <ListItems data={newProduct} />
          </div>
          <div className="w-full">
            <div className=" py-4">
              <Separator className=" bg-gray-300" />
              <div className="flex items-center">
                <h2 className="text-xl lg:text-3xl font-semibold my-4 text-black">Sản phẩm hot</h2>
                <Link href="/san-pham-noi-bat">
                  <div className="flex items-center group relative overflow-hidden ml-4 cursor-pointer pr-24">
                    <h3 className="text-sm absolute left-0 opacity-0 -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap group-hover:text-red-500">
                      Xem thêm
                    </h3>
                    <ChevronRight
                      className="transition-transform duration-300 group-hover:translate-x-[calc(100%+3rem)] group-hover:text-red-500" // Thay đổi ở đây
                      size={20}
                    />
                  </div>
                </Link>
              </div>
            </div>
            <ListItems data={hotProduct} />
          </div>
        </div>
      </div>
      <FooterC />
    </>
  );
}
