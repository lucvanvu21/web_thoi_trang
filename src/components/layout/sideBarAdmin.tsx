'use client';
import * as React from 'react';
import { AudioLines, BookOpen, Bot, Earth, Settings2, ShoppingCart, SquareTerminal, User } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '@/components/ui/sidebar';

const data = {
  user: {
    name: 'admin',
    email: '',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Thống kê',
      url: '/admin/dashboard',
      icon: AudioLines,
    },
    {
      title: 'Danh mục',
      url: '/admin/category',
      icon: BookOpen,
    },
    {
      title: 'Thuộc tính',
      url: '/admin/attribute',
      icon: Earth,
    },
    {
      title: 'Sản phẩm',
      url: '/admin/product',
      icon: SquareTerminal,
    },
    {
      title: 'Đơn hàng',
      url: '/admin/order',
      icon: ShoppingCart,
    },
    // {
    //   title: 'Người dùng',
    //   url: '/admin/users',
    //   icon: SquareTerminal,
    // },
    // {
    //   title: 'Phim',
    //   url: '#',
    //   icon: SquareTerminal,
    //   isActive: true,
    //   items: [
    //     {
    //       title: 'crawl',
    //       url: '/admin/crawl',
    //     },
    //     {
    //       title: 'Danh mục',
    //       url: '/admin/category',
    //     },
    //     {
    //       title: 'Phim Lẻ',
    //       url: '/admin/movie',
    //     },
    //     {
    //       title: 'Phim Bộ',
    //       url: '/admin/series',
    //     },
    //     {
    //       title: 'Thêm Phim',
    //       url: '/admin/add-movie',
    //     },
    //   ],
    // },
    // {
    //   title: 'Thể Loại',
    //   url: '/admin/genres',
    //   icon: Bot,
    //   items: [
    //     {
    //       title: 'Genesis',
    //       url: '#',
    //     },
    //     {
    //       title: 'Explorer',
    //       url: '#',
    //     },
    //     {
    //       title: 'Quantum',
    //       url: '#',
    //     },
    //   ],
    // },
 
    {
      title: 'Người dùng',
      url: '/admin/users',
      icon: User,
    },

    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
};

export function SideBarAdmin({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader><TeamSwitcher teams={data.teams} /></SidebarHeader> */}
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
