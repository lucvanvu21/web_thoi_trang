'use client';
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useRouter, useSearchParams } from 'next/navigation';

const SortProduct = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleChange1 = (sort: string) => {
    const params = new URLSearchParams(searchParams);

    // Set hoặc cập nhật tham số page
    params.set('sort', sort.toString());

    // Tạo query string mới
    const queryString = params.toString();

    // Điều hướng với query string mới
    router.push(`?${queryString}`);
    // setLoading(true);
  };
  return (
    <div>
      <Select
        onValueChange={value => {
          // console.log(value);
          handleChange1(value)
        }}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Sắp xếp" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {/* <SelectLabel>Fruits</SelectLabel> */}
            <SelectItem value="gia-tang-dan" onClick={() => handleChange1('gia-tang-dan')}>
              Giá: tăng dần
            </SelectItem>
            <SelectItem value="gia-giam-dan">Giá: giảm dần</SelectItem>
            <SelectItem value="ten-a-z">Tên: A-Z</SelectItem>
            <SelectItem value="ten-z-a">Tên: Z-A</SelectItem>
            <SelectItem value="moi-nhat">Mới nhất</SelectItem>
            <SelectItem value="cu-nhat">Cũ nhất</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortProduct;
