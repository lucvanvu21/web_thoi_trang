'use client';
import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade'
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from '@/components/ui/carousel';
import Image from 'next/image';
// import { Badge } from './ui/badge';
// import { Button } from './ui/button';
// import Link from 'next/link';
// import { Play } from 'lucide-react';


export function CarouselTop({ data }: { data: {name: number, src: string}[] }) {
  return (
    <Carousel
      opts={{
        loop: true,
        duration: 100,
    
      }}
      plugins={[
        Autoplay({
          delay: 15000,
        }),
        Fade()
      ]}
    >
      <CarouselContent className="m-0 p-0 ">
        {Array.from(data).map((item, index) => (
          <CarouselItem key={index}>
            <div>
              <Card className="rounded-none">
                <CardContent className="flex aspect-auto items-center justify-center p-0 relative">
                  <Image
                    src={
                      item?.src
                    }
                    alt={`${item?.name}`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    quality={90}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    priority={index === 0}
                    style={{
                      objectFit: 'cover',
                      borderRadius: '0.5rem',
                      width: '100%',
                      height: 'auto',
                      maxHeight: '800px',
                    }}
                  />
                  <div
                    className="absolute top-0 w-full h-full z-10 hidden md:block"
                    style={{
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.3) 90%)',
                    }}
                  ></div>
                  <div
                    className="absolute  w-full h-full z-10 block md:hidden border-none"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(11, 23, 35,0.7) 0%, rgba(11, 23, 35,0) 40%, rgba(11, 23, 35,0) 100%)',
                    }}
                  ></div>
                  <div
                    className="absolute top-2 w-full h-full z-10 block md:hidden border-none"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(11, 23, 35,0) 0%, rgba(11, 23, 35,0.1) 40%, rgba(11, 23, 35,1) 100%)',
                    }}
                  ></div>

                  {/* <div className="absolute w-full top-2/4 z-20 flex justify-center md:justify-start md:left-[10%]">
                    <div className="md:hidden  flex flex-col justify-center items-center w-full">
                      <h1 className="text-2xl font-semibold  ">{item?.name}</h1>
                      <Link href={'phim/' + item?.kkslug}>
                        <Button
                          variant="outline"
                          className="bg-inherit border-primary rounded-3xl font-medium  hover:text-primary hover:bg-gradient-to-r hover:from-[#fc000c] hover:to-[#f9444d] "
                        >
                          <Play className="text-primary text-4xl " />
                        </Button>
                      </Link>
                    </div>

                    <div className="hidden md:block w-[50%]">
                      <h1 className="text-4xl lg:text-5xl font-semibold  ">{item?.name}</h1>
                      <div className="my-4">
                        {item?.genres.map(genre => (
                          <Link href={'the-loai?the-loai=' + genre.slug} key={genre._id}>
                            <Badge
                              className="hover: cursor-pointer py-1 hover:bg-slate-500 hover:text-indigo-50 mr-3 rounded-xl border-slate-300"
                              variant="outline"
                            >
                              {genre.name}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                      <h4 className="line-clamp-2  my-4 md:w-[70%] lg:w-[100%]">{item?.content}</h4>
                      <div>
                        <Link href={'phim/' + item?.kkslug}>
                          <Button className="text-lg rounded-2xl lg:p-5 font-medium hover:bg-secondary hover:text-primary hover:bg-gradient-to-r hover:from-[#fc000c] hover:to-[#f9444d] ">
                            <Play /> Xem Ngay
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div> */}
                  {/* <span className="text-4xl font-semibold">{item?.name}</span> */}
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious className="hidden md:flex left-5 h-10 w-10" />
      <CarouselNext className=" hidden md:flex right-5 h-10 w-10" /> */}
      <CarouselDots
        className="absolute -bottom-0 left-1/2 transform -translate-x-1/2  md:bottom-16 md:right-[10%] md:-translate-x-0"
        thumbnails={data}
      />
    </Carousel>
  );
}
