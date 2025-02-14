'use client';
import React, { useCallback, useRef, useState } from 'react';
import { NavigationMenuItem } from '../ui/navigation-menu';
import { Input } from '../ui/input';
import { Loader2, Search, X } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
// import { moviesServer } from '@/requestApi/movies/moviesServer';
import Link from 'next/link';
import Image from 'next/image';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import { productReq } from '@/requestApi/product/productReq';
import { ProductPaginateType, ProductType } from '@/types/indexType';

const SearchX = () => {
  const router = useRouter();
  // const [menuOpen, setMenuOpen] = useState(false);

  const form = useForm({
    defaultValues: { query: '' },
  });
  // const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const lastSearchRef = useRef('');

  const debouncedSearch = useCallback(
    debounce(query => {
      if (query.trim().length > 0 && query !== lastSearchRef.current) {
        setIsLoading(true);
        searchMovies(query);
        lastSearchRef.current = query; // Cập nhật query đã search
      } else if (query.trim().length === 0) {
        setSearchResults([]);
        setShowResults(false);
        lastSearchRef.current = ''; // Reset query khi input trống
      }
    }, 400),
    []
  );
  const searchMovies = async query => {
    if (query.length > 0) {
      // setIsLoading(true);
      const res = await productReq.getAllOrSearch<ProductPaginateType>(1,10,query);
      if (res.error) {
        setIsLoading(false);
        setSearchResults([]);
        return [];
      }
      setIsLoading(false);
      setSearchResults(res.items);
      setShowResults(true);
    }
  };

  const handleSearch = data => {
    const query = data.query.trim();
    if (query.length > 0) {
      router.push(`/tim-kiem?query=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };
  const handleInputChange = () => {
    const query = form.getValues('query');
    if (query.length === 0) {
      setShowResults(false);
      setSearchResults([]);
    }

    if (query !== lastSearchRef.current) {
      if (query !== lastSearchRef.current) {
        debouncedSearch(query);
      } else {
        // Nếu query giống với lần search trước, chỉ hiện lại kết quả cũ
        setShowResults(searchResults.length > 0);
      }
    }
  };

  // console.log('searchResults', searchResults);
  return (
    <>
      <div className="mr-4 md:w-[300px] ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSearch)} className="w-full space-y-6 ">
            <div className="relative w-full">
              <FormField
                control={form.control}
                name="query"
                // onChange={handleInputChange}
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Username</FormLabel> */}
                    <FormControl>
                      <Input
                        value={field.value}
                        placeholder="Tìm kiếm ..."
                        {...field}
                        onChange={e => {
                          field.onChange(e); // Hàm của react-hook-form
                          handleInputChange(); // Hàm của bạn
                        }}
                        onBlur={() => {
                          setTimeout(() => setShowResults(false), 200);
                        }}
                        onFocus={() => {
                          if (form.getValues('query').trim().length > 0) {
                            setShowResults(true);
                          }
                        }}
                        className="w-full lg:min-w-[300px] pl-9 border border-gray-400"
                      />
                    </FormControl>
                    {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {form.getValues('query') && isLoading === false && (
                <div
                  onClick={() => {
                    lastSearchRef.current = '';
                    // setSearchResults([]);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-inherit hover:text-primary cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </div>
              )}
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1/2 transform -translate-y-1/2 hover:bg-inherit hover:text-primary "
              >
                <Search className="h-4 w-4 " />
              </Button>
            </div>
          </form>
        </Form>
        {showResults && searchResults.length > 0 && (
          // <div>
          //   {searchResults.map((movie: IMovies) => (
          //     <Link key={movie._id} href={`/phim/${movie.kkslug}`}>
          //       {movie.name}
          //     </Link>
          //   ))}
          //   {/* <div></div> */}
          // </div>
          <div className=" relative">
            {/* {showResults && searchResults && ( */}
            <div className="absolute top-full mt-1 w-full bg-background border rounded-md shadow-lg z-50">
              <ScrollArea className="h-[400px]">
                {searchResults.length > 0 ? (
                  searchResults.map((product: ProductType) => (
                    <Link
                      key={product.id}
                      href={`/san-pham/${product.slug}`}
                      // onClick={() => {
                      //   setShowResults(false);
                      //   setSearchQuery('');
                      // }}
                      className="grid grid-cols-[minmax(48px,1fr),minmax(80px,4fr)] p-2 hover:bg-gray-300 cursor-pointer"
                      // style={{
                      //   gridTemplateColumns: 'repeat(auto-fit, minmax(30px, 1fr))',
                      // }}
                    >
                      <div className="w-12 h-16 relative mr-2">
                        <Image
                          src={
                            product?.images[0]?.url
                          }
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium line-clamp-1 text-sm">{product.name}</h4>
                        {/* <p className="text-sm text-muted-foreground">{product.year}</p> */}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-sm text-muted-foreground">Không tìm thấy kết quả</div>
                )}
              </ScrollArea>
            </div>
            {/* )} */}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchX;
