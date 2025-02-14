'use client';
import Image from 'next/image';
import React from 'react';
// import LoadingCard from './loading';
import { Skeleton } from './ui/skeleton';
import { ProductType } from '@/types/indexType';

const ImageCard = ({ product, index }: { product: ProductType; index?: number }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <>
      {isLoading && <Skeleton className="absolute inset-0 rounded-xl bg-muted" />}
      <Image
        src={product?.images[0].url.startsWith('https') ? product?.images[0].url : `/placeholder.png`}
        alt={product?.name}
        loading={index === 0 ? 'eager' : 'lazy'}
        priority={index === 0}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,..."
        sizes="50vw"
        quality={50}
        className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
        onLoad={() => setIsLoading(false)}
        // onLoad={() => setIsLoading(true)}
        style={{
          width: '100%',
          borderRadius: '8px',
          height: '100%',
          transition: 'transform 0.3s ease',
        }}
        fill
      />
      {/* </Suspense> */}
      {/* </div> */}
    </>
  );
};

export default ImageCard;

// // components/ImageCard.tsx
// 'use client';

// import Image from 'next/image';
// import React, { useState, useEffect } from 'react';
// import { Skeleton } from '@/components/ui/skeleton';

// const ImageCard = ({ movies }: { movies: IMovies }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [optimizedSrc, setOptimizedSrc] = useState<string>('');

//   useEffect(() => {
//     if (movies?.poster_url.startsWith('/')) {
//       setOptimizedSrc(`${process.env.NEXT_PUBLIC_IMAGE}${movies?.poster_url}`);
//       return;
//     }
//     const originalSrc = movies?.poster_url.startsWith('http')
//       ? movies?.poster_url
//       : `${process.env.NEXT_PUBLIC_IMAGE}${movies?.poster_url}`;

//     // Kiểm tra cache
//     const cachedSrc = sessionStorage.getItem(`optimized_${movies._id}`);
//     if (cachedSrc) {
//       setOptimizedSrc(cachedSrc);
//       return;
//     }
//     // if (movies?.poster_url.startsWith('http')) {
//     //   setOptimizedSrc(movies?.poster_url);
//     //   sessionStorage?.setItem(`optimized_${movies._id}`, movies?.poster_url);
//     // }
//     // // Optimize và cache
//     // fetch('api/resize', {
//     //   method: 'POST',
//     //   headers: {
//     //     'Content-Type': 'application/json',
//     //   },
//     //   body: JSON.stringify({ url: originalSrc }),
//     // })
//     //   .then(res => res.json())
//     //   .then(data => {
//     //     // console.log(data);
//     //     setOptimizedSrc(data.optimizedUrl);
//     //     sessionStorage.setItem(`optimized_${movies._id}`, data.optimizedUrl);
//     //   })
//     //   .catch(() => {
//     //     setOptimizedSrc(originalSrc); // Fallback to original URL
//     //   });
//   }, [movies]);

//   // console.log('optimizedSrc:', optimizedSrc);
//   return (
//     <>
//       {isLoading && <Skeleton className="absolute inset-0 rounded-lg" />}
//       <Image
//         src={optimizedSrc || '/placeholder.png'}
//         alt={movies?.name + '|' + movies?.engName}
//         loading="lazy"
//         placeholder="blur"
//         blurDataURL="data:image/svg+xml;base64,..."
//         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//         quality={75} // Đã tối ưu rồi nên để 100%
//         className={`group-hover:scale-105 transition-all duration-300 ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}
//         style={{
//           width: '100%',
//           borderRadius: '8px',
//           height: '100%',
//           transition: 'all 0.3s ease',
//         }}
//         fill
//         onLoadingComplete={() => setIsLoading(false)}
//         onError={() => {
//           setIsLoading(false);
//           setOptimizedSrc(movies?.poster_url || '/placeholder.png');
//         }}
//       />
//     </>
//   );
// };

// export default ImageCard;
