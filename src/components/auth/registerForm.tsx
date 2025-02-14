'use client';
import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { RegisterBody, RegisterBodyType } from '@/types/authSchema';
import { authenticate, registerApi } from '@/requestApi/auth/login';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const RegisterForm = () => {
  const router = useRouter();
  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
  });
  const onSubmit = async (values: RegisterBodyType) => {
    // console.log(values);
    const res = await registerApi(values);
    console.log('res form', res);
    if (!(res.statusCode === 201)) {
      toast({
        variant: 'destructive',
        title: 'Đăng ký thất bại',
        description: res.message || res.error,
      });
    } else {
      await authenticate(values.email, values.password);
      router.push('/admin/dashboard');
      toast({
        title: 'Đăng ký thành công',
        // description: 'Đăng nhập thành công',
      });
    }
  };
  return (
    <>
      <div className="w-full max-w-md p-6 pb-0 sm:p-10 md:p-14 md:pb-0  rounded-xl  h-full ">
        {/* <CardHeader className="text-center text-xl md:text-2xl">Đăng Nhập</CardHeader> */}
        <h1 className="text-center text-2xl">Đăng Ký</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Đăng Ký
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default RegisterForm;
