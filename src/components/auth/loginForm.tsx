'use client';
import React, { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { LoginBody, LoginBodyType } from '@/types/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { authenticate } from '@/requestApi/auth/login';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import RegisterForm from './registerForm';

const LoginForm = () => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  async function onSubmit(values: LoginBodyType) {
    // console.log(values);/
    const res = await authenticate(values.email, values.password);
    console.log('res form', res);
    if (!res.ok) {
      toast({
        variant: 'destructive',
        title: 'Đăng nhập thất bại',
        description: res.message || res.error,
      });
    } else {
      router.push('/admin/dashboard');

      toast({
        title: 'Đăng nhập thành công',
      });
    }
  }
  return (
    <>
      <div className="w-full p-6 sm:p-10 md:p-14 h-full rounded-2xl  ">
        {/* <CardHeader className="text-center text-xl md:text-2xl">Đăng Nhập</CardHeader> */}
        <h1 className="text-center text-2xl">Đăng nhập</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8 w-full">
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
            <Button type="submit" className="w-full bg-black text-white hover:bg-black/80 rounded-xl" >
              Đăng nhập
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Bạn chưa có tài khoản?
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="link" onClick={() => setIsDialogOpen(true)} className='text-blue-500'>
                Đăng Ký
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-50">
              <RegisterForm />
              <div className="mt-4 text-center text-sm">
                Bạn đã có tài khoản?
                <Button variant="link" onClick={() => setIsDialogOpen(false)} className='text-blue-500'>
                  Đăng Nhập
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
