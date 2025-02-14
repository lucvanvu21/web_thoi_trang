'use client'
import ImageCard from './imageCard';
import Link from 'next/link';
// import { PaginationPage } from './pagination';
import { cn } from '@/lib/utils';
import { ProductPaginateType } from '@/types/indexType';
import { PaginationPage } from './pagination';

const ListItems = ({ data }: { data: ProductPaginateType }) => {
  console.log(data);
  // const x = pagination?.limit > 15 ? 'xl:grid-cols-8' : 'xl:grid-cols-6';
  return (
    <>
      <div className={cn('grid grid-rows-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4  gap-6')}>
        {data?.items?.map((item, index) => {
          return (
            <div key={index}>
              <Link href={'/san-pham/' + item.slug}>
                <div className="relative pb-[143%] group overflow-hidden rounded-lg ">
                  <ImageCard product={item} index={index} />
                  {/* <div className="absolute top-0 right-0 z-20 bg-[#27a35b] font-semibold pt-1 px-2 text-center text-sm rounded-bl-[4px]">
                    {item?.episode_current && item?.type === 'series' ? <h4>{item.episode_current}</h4> : <h4>Trọn bộ</h4>}
                  </div> */}
                </div>
                <div className="mt-1">
                  <h2 className="text-md text-black line-clamp-1 hover:text-primary ">{item.name}</h2>
                  <h2 className="text-md text-black font-semibold line-clamp-1 ">
                    {item.variants[0].price.toLocaleString('vi-VN')} đ
                  </h2>
                  {/* <p className="text-sm text-gray-500">{item.year}</p> */}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      {data?.meta?.itemsPerPage>12 && data?.meta?.totalPages > 1 && (
        <div className="my-7 pt-4 z-1 border-t">
          <PaginationPage totalPage={data?.meta?.totalPages} currentPage={data?.meta?.currentPage} />
        </div>
      )}
    </>
  );
};

export default ListItems;
