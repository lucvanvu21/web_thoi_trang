'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { userReq } from '@/requestApi/user/userRequest';
import { UpdateUser, UpdateUserType } from '@/types/authSchema';
import { UserType } from '@/types/indexType';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const Profile = () => {
  // const router = useRouter();
  const { data: session } = useSession();
  const form = useForm<UpdateUserType>({
    resolver: zodResolver(UpdateUser),
  });
  useEffect(() => {
    // if (!session) {
    //   router.push('/');
    //   toast({
    //     variant: 'destructive',
    //     title: 'Vui lòng đăng nhập',
    //   });
    // }
    const fetchUser = async () => {
      const res = await userReq.getProfile<UserType>(session.accessToken);
      if (!res.id) {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: res.error,
        });
      } else {
        form.reset({
          fullName: res.fullName,
          phone: res.phone,
          address: res.address,
        });
      }
    };
    if (session) {
      fetchUser();
    }
  }, [session]);
  async function onSubmit(accessToken: string, values: UpdateUserType) {
    // console.log(values);/
    const res = await userReq.updateUser<IRes>(accessToken, values);
    console.log('res form', res);
    if (res.error) {
      toast({
        variant: 'destructive',
        title: 'Cập nhật thất bại',
        description: res.message || res.error,
      });
    } else {
      toast({
        title: 'Cập nhật thành công',
        description: res.message || 'Cập nhật thành công',
      });
    }
  }
  return (
    <div className="w-full p-6 sm:p-10 md:p-14  h-full rounded-2xl flex flex-col gap-1 items-center justify-center ">
      {/* <CardHeader className="text-center text-xl md:text-2xl">Đăng Nhập</CardHeader> */}
      <h1 className="text-center text-2xl">Cập nhật thông tin</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(values => onSubmit(session.accessToken, values))}
          className="space-y-6 sm:space-y-8 w-[60%]"
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>FullName</FormLabel>
                <FormControl>
                  <Input placeholder="FullName" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Address" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-black text-white hover:bg-black/80 rounded-xl">
            Cập nhật
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
