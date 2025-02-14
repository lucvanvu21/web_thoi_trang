'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import React, { useEffect, useState } from 'react';
// import { Input } from '../ui/input';
// import { signOut, useSession } from 'next-auth/react';
// import { Avatar, AvatarFallback } from '../ui/avatar';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '../ui/dropdown-menu';
// import { logoutApi } from '@/requestApi/auth/login';
import { useIsMobile } from '@/hooks/use-mobile';

import { MobileHeader } from './mobile-header';
import SearchX from './search';
import { signOut, useSession } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ShoppingCartIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import LoginForm from '../auth/loginForm';
import { logoutApi } from '@/requestApi/auth/login';
import { useCategoryStore } from '@/app/store/cateStore';
import { cateReq } from '@/requestApi/category/cateReq';
import { CategoryType } from '@/types/indexType';
import { useCartStore } from '@/app/store/cartStore';
import { usePathname } from 'next/navigation';

export const pages = [
  {
    label: 'Hàng Mới',
    href: '/san-pham-moi',
  },
  {
    label: 'Sản phẩm nổi bật',
    href: '/san-pham-noi-bat',
  },
  // {
  //   label: 'Phim Lẻ',
  //   href: '/phim-le',
  // },
  // {
  //   label: 'Phim Bộ',
  //   href: '/phim-bo',
  // },
  {
    label: 'Sản Phẩm',
    href: '#',
    submenus: [],
  },
  // {
  //   label: 'Thể Loại',
  //   href: '#',
  //   submenus: [
  //     { href: '/the-loai?t=am-nhac', label: 'Âm Nhạc' },
  //     { href: '/the-loai?t=bi-an', label: 'Bí Ẩn' },
  //     { href: '/the-loai?t=chien-tranh', label: 'Chiến Tranh' },
  //     { href: '/the-loai?t=chinh-kich', label: 'Chính Kịch' },
  //     { href: '/the-loai?t=co-trang', label: 'Cổ Trang' },
  //     { href: '/the-loai?t=gia-dinh', label: 'Gia Đình' },
  //     { href: '/the-loai?t=hai-huoc', label: 'Hài Hước' },
  //     { href: '/the-loai?t=hanh-dong', label: 'Hành Động' },
  //     { href: '/the-loai?t=hinh-su', label: 'Hình Sự' },
  //     { href: '/the-loai?t=hoat-hinh', label: 'Hoạt hình' },
  //     { href: '/the-loai?t=hoc-duong', label: 'Học Đường' },
  //     { href: '/the-loai?t=khoa-hoc', label: 'Khoa Học' },
  //     { href: '/the-loai?t=kinh-di', label: 'Kinh Dị' },
  //     { href: '/the-loai?t=kinh-dien', label: 'Kinh Điển' },
  //     { href: '/the-loai?t=lich-su', label: 'Lịch Sử' },
  //     { href: '/the-loai?t=mien-tay', label: 'Miền Tây' },
  //     { href: '/the-loai?t=phieu-luu', label: 'Phiêu Lưu' },
  //     { href: '/the-loai?t=tai-lieu', label: 'Tài Liệu' },
  //     { href: '/the-loai?t=tam-ly', label: 'Tâm Lý' },
  //     { href: '/the-loai?t=than-thoai', label: 'Thần Thoại' },
  //     { href: '/the-loai?t=the-thao', label: 'Thể Thao' },
  //     { href: '/the-loai?t=tinh-cam', label: 'Tình Cảm' },
  //     { href: '/the-loai?t=tre-em', label: 'Trẻ Em' },
  //     { href: '/the-loai?t=vien-tuong', label: 'Viễn Tưởng' },
  //     { href: '/the-loai?t=vo-thuat', label: 'Võ Thuật' },
  //   ],
  // },
  {
    label: 'Hướng Dẫn Mua Hàng',
    href: '/huong-dan-mua-hang',
  },
];

const Header = ({ top }: { top?: boolean }) => {
  const { data: session } = useSession();
  const b = top ? false : true;
  const isMobile = useIsMobile();
  const [isAtTop, setIsAtTop] = useState(true);
  const { categories, setCategories } = useCategoryStore();
  const { totalAmount } = useCartStore(); // Lấy tổng số lượng từ store
  const currentPath = usePathname();
  // console.log('sess', session);
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await cateReq.getCategory<CategoryType[]>();
        // console.log('data---cate->', data);
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    if (categories.length === 0) loadCategories();
  }, [categories.length, setCategories]);
  useEffect(() => {
    // console.log('session: ', session);
    if (session?.accessTokenExpires === 0) {
      signOut({ callbackUrl: '/' });
    }
  }, [session]);
  // const handleClickOutside = useCallback(e => {
  //   if (!e.target.closest('.search-container')) {
  //     // console.log('click outside');
  //     setShowResults(false);
  //   }
  // }, []);
  // Cleanup debounce on unmount

  // useEffect(() => {
  //   document.addEventListener('click', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('click', handleClickOutside);
  //   };
  // }, [handleClickOutside]);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // useEffect(() => {
  //   if (session && session.accessTokenExpires === 0) {
  //     signOut({ callbackUrl: '/' });
  //   }
  // }, [session]);

  // useEffect(() => {
  //   return () => {
  //     debouncedSearch.cancel();
  //   };
  // }, [debouncedSearch]);

  const handleLogout = async session => {
    // console.log('session', session);
    await signOut({ callbackUrl: '/' });
    await logoutApi(session?.accessToken);
  };

  console.log(categories);
  // const MobileMenu = () => (

  // );
  // console.log('searchResults'/, showResults);
  // console.log('searchResults', searchQuery);
  // const SearchInput = () => (

  // );

  const DesktopNav = () => (
    <>
      <NavigationMenu className="flex justify-between">
        <div className="pr-4 min-w-[60px]">
          <Link href="/" className="text-2xl font-bold">
            <div className="font-bold text-2xl  uppercase">
              <span className="text-[#c0261a] tracking-tightest">HANG</span>
              <span className="tracking-tightest">THOITRANG</span>
            </div>
          </Link>
        </div>
        <NavigationMenuList>
          {pages.map(page => (
            <NavigationMenuItem key={page.label}>
              {page.submenus ? (
                <>
                  <NavigationMenuTrigger className="bg-inherit text-[16px]">{page.label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background text-black">
                      {Array.isArray(categories) &&
                        categories
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map(item => {
                            if (item.isActive)
                              return (
                                <Link
                                  key={item.id}
                                  href={'/danh-muc/' + item.slug}
                                  className={cn(
                                    'block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-600 hover:text-accent-foreground focus:bg-slate-500 focus:text-accent-foreground'
                                  )}
                                >
                                  <div className="text-sm font-semibold leading-none uppercase ">{item.name}</div>
                                </Link>
                              );
                          })}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <Link href={page.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    style={{ fontSize: '16px' }}
                    active={page.href === currentPath}
                  >
                    {page.label}
                  </NavigationMenuLink>
                </Link>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );

  return (
    <header
      className={`h-16 fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        isAtTop ? ` ${b ? 'bg-white text-black' : 'bg-transparent text-white'} ` : 'bg-white shadow-md text-black'
      }`}
    >
      <div className="px-4 md:px-12 h-full flex justify-between items-center w-full">
        {!isMobile && <DesktopNav />}
        <div className="flex items-center justify-between md:flex md:justify-end w-full">
          <SearchX />
          <NavigationMenu className="flex gap-2">
            <NavigationMenuList>
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>{session?.user?.email?.substring(0, 3)}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/profile">Thông tin</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/don-hang">Đơn hàng của tôi</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLogout(session)}>Đăng xuất</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <NavigationMenuItem className="min-w-[100px]">
                  {/* <Link href="/sign-in" passHref>
                  Đăng Nhập
                  </Link> */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost">Đăng Nhập</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-50 rounded-2xl ">
                      <LoginForm />
                    </DialogContent>
                  </Dialog>
                </NavigationMenuItem>
              )}
              <Link href="/gio-hang" className="relative flex items-center pr-2 sm:pr-1 ">
                {/* Biểu tượng giỏ hàng */}
                <ShoppingCartIcon size={24} />

                {/* Hiển thị số lượng sản phẩm nếu lớn hơn 0 */}
                {
                  <div className=" absolute -bottom-1 left-5 flex justify-center items-center w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full">
                    {totalAmount > 0 ? totalAmount : 0}
                  </div>
                }
              </Link>
              {isMobile && <MobileHeader pages={pages} categories={categories} />}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
