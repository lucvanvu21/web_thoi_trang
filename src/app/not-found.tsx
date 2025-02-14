import Link from 'next/link';
import React from 'react';

const NotFound = () => {
  return (
    <div className='flex justify-center items-center'>
      <div className='flex flex-col gap-3'>
        <h2 className='text-3xl'>
          404
        </h2>
        <h3 >
          Trang không tồn tại
        </h3>
        <Link href="/">Quay lại trang chủ</Link>
      </div>
    </div>
  );
};

export default NotFound;
