'use client';
import * as React from 'react';
// import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
import Link from 'next/link';
export interface IActor {
  actorId: string;
  actorName: string;
  actorPoster?: string;
  character?: string;
}
type DataItem = IMovies | IActor;
export function Carousel2({ data }: { data: DataItem[] }) {
  return (
    <Carousel className="w-full mx-auto" opts={{ align: 'start' }}>
      <CarouselContent className="-ml-1">
        {data.length > 0 &&
          data?.map((item, index) => (
            <CarouselItem
              key={'_id' in item ? item._id : (item as IActor).actorId}
              className={`px-2 ${
                'thumb_url' in item
                  ? 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5'
                  : 'basis-1/3 sm:basis-1/4 md:basis-1/4 lg:basis-1/6 px-4'
              }`}
            >
              <Link
                href={
                  'kkslug' in item
                    ? `phim/${item.kkslug}`
                    : `/dien-vien/${item?.actorName?.replace(/\s/g, '-').toLowerCase()}~${item.actorId}`
                }
              >
                <div>
                  <Card className="rounded-xl border-none">
                    <CardContent className="group flex aspect-auto items-center justify-center p-0 relative hover:cursor-pointer bg-background">
                      <div className={`${'thumb_url' in item ? 'pb-[57%]' : 'pb-[100%]'}`}>
                        <Image
                          src={
                            'thumb_url' in item
                              ? item.thumb_url?.startsWith('http')
                                ? item.thumb_url
                                : `${process.env.NEXT_PUBLIC_THUMB2}${item.thumb_url}`
                              : item.actorPoster.includes('null')
                              ? '/placeholder.png'
                              : item?.actorPoster
                          }
                          alt={'name' in item ? item.name : item.actorName}
                          quality={100}
                          fill
                          onError={e => console.log('img err', e)}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          priority={index === 0}
                          style={{
                            width: '100%',
                            borderRadius: '0.5rem',
                            objectPosition: 'center 30%',
                            objectFit: 'cover',
                            maxHeight: '700px',
                            zIndex: 0,
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
                      </div>
                      {'episode_current' in item && 'type' in item && (
                        <div className="absolute top-0 right-0 z-20 bg-[#27a35b] font-semibold pt-1 px-2 text-center text-sm rounded-bl-[4px]">
                          {item?.episode_current && item?.type === 'series' ? <h4>{item.episode_current}</h4> : <h4>Trọn bộ</h4>}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                {'name' in item ? (
                  <h4 className="hover:text-primary m-2 line-clamp-1">{item.name}</h4>
                ) : (
                  <>
                    <h4 className="hover:text-primary m-2 line-clamp-1">{item.actorName}</h4>
                    <h4 className="text-sm text-center text-gray-400 line-clamp-1">{item.character}</h4>
                  </>
                )}
              </Link>
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious className="lg:-left-3 top-[40%] left-0 lg:h-9 lg:w-9 bg-white text-black border-none" />
      <CarouselNext className="lg:-right-2 top-[40%] right-0 lg:h-9 lg:w-9 bg-white text-black border-none" />
    </Carousel>
  );
}
