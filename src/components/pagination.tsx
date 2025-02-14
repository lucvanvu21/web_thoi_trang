'use client';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { useRouter,useSearchParams } from 'next/navigation';

export function PaginationPage({
  totalPage,
  currentPage,
  // setLoading
}: // handleChange,
{
  totalPage: number;
  currentPage: number;
  // setLoading?: (value: boolean) => void;
  // handleChange?: (page: number) => void;
}) {
  const getPaginationItems = () => {
    const delta = 2; // Số trang xung quanh trang hiện tại
    const items: (number | string)[] = [];

    for (let i = 1; i <= totalPage; i++) {
      if (
        i === 1 || // Trang đầu tiên
        i === totalPage || // Trang cuối cùng
        (i >= currentPage - delta && i <= currentPage + delta) // Các trang xung quanh trang hiện tại
      ) {
        items.push(i);
      } else if (items[items.length - 1] !== '...') {
        items.push('...');
      }
    }

    return items;
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  // const searchParams = router.query;
  // console.log('searchParams:---->', searchParams);
  const paginationItems = getPaginationItems();
  // console.log('paginationItems:---->', paginationItems);
  const handleChange1 = (page: number) => {
    const params = new URLSearchParams(searchParams);

    // Set hoặc cập nhật tham số page
    params.set('page', page.toString());

    // Tạo query string mới
    const queryString = params.toString();

    // Điều hướng với query string mới
    router.push(`?${queryString}`);
    // setLoading(true);
  };
  return (
    // <Pagination>
    //   <PaginationContent>
    //     <PaginationItem>
    //       <PaginationPrevious href="#" />
    //     </PaginationItem>
    //     <PaginationItem>
    //       <PaginationLink href="#">1</PaginationLink>
    //     </PaginationItem>
    //     <PaginationItem>
    //       <PaginationLink href="#" isActive>
    //         2
    //       </PaginationLink>
    //     </PaginationItem>
    //     <PaginationItem>
    //       <PaginationLink href="#">3</PaginationLink>
    //     </PaginationItem>
    //     <PaginationItem>
    //       <PaginationEllipsis />
    //     </PaginationItem>
    //     <PaginationItem>
    //       <PaginationNext href="#" />
    //     </PaginationItem>
    //   </PaginationContent>
    // </Pagination>
    <Pagination>
      <PaginationContent className='flex gap-2'>
        {/* Nút Previous */}
        <PaginationItem>
          <PaginationPrevious onClick={() => handleChange1(Math.max(currentPage - 1, 1))} className="cursor-pointer" />
        </PaginationItem>

        {/* Danh sách các trang */}
        {paginationItems.map(item =>
          item === '...' ? (
            <PaginationEllipsis key={item} />
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                className="border border-gray-400 cursor-default md:w-12 md:h-10 font-semibold"
                // href={`?page=${Number(index) + 1}`}
                onClick={() => handleChange1(Number(item))}
                isActive={currentPage === item}
              >
                {Number(item)}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Nút Next */}
        <PaginationItem>
          <PaginationNext onClick={() => handleChange1(Math.min(currentPage + 1, totalPage))} className="cursor-pointer" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
