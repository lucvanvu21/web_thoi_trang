'use client';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { CreateCategory, CreateCategoryType } from '@/types/categorySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { cateReq } from '@/requestApi/category/cateReq';
import { CategoryType } from '@/types/indexType';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import DialogDel from '../dialogDel';
import { toast } from '@/hooks/use-toast';
import slugify from 'react-slugify';
import { useCategoryStore } from '@/app/store/cateStore';

const CategoryPage = ({ dataCate }: { dataCate: CategoryType[] }) => {
  const { data: session } = useSession();
  const [cate, setCate] = useState<CategoryType | null>(null);
  const { setCategories } = useCategoryStore();
 
  const header = [
    // { title: 'Tên' },
    { title: 'ID' },
    { title: 'TÊN' },
    { title: 'SUG' },
    { title: 'HIỂN THỊ' },
    { title: 'HÀNH ĐỘNG' },
  ];

  const form = useForm<CreateCategoryType>({
    resolver: zodResolver(CreateCategory),
  });
  const onSubmit = async (accessToken: string, values: CreateCategoryType) => {
    const res = await cateReq.createCategory<IRes>(accessToken, values);
    if (res.statusCode === 201) {
      toast({
        title: 'Thêm thành công',
      });
      setCategories(dataCate);
    } else {
      toast({
        title: 'Thêm thất bại',
        description: res.message || res.error,
      });
    }
  };
  const handleDel = async (id: number) => {
    const res = await cateReq.deleteCategory<IRes>(session.accessToken, id);
    // console.log(res);
    if (res.statusCode === 200) {
      toast({
        title: 'Xóa thành công',
      });
      setCategories(dataCate);
    } else {
      toast({
        title: 'Xóa thất bại',
        description: res.message || res.error,
      });
    }
  };
  // console.log('dataCate', form.formState.errors);
  return (
    <div>
      <div className="p-6 mt-20 flex gap-3">
        <div className="w-[30%] rounded-lg shadow-xl p-4 h-fit">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(values => onSubmit(session?.accessToken, values))}
              className="space-y-6 sm:space-y-8 w-full"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="tên danh mục"
                        type="text"
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          form.setValue('slug', slugify(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="slug" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>description</FormLabel>
                    <FormControl>
                      <Input placeholder="Mô tả" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormLabel>Hiển thị</FormLabel>
                    <FormControl>
                      <Checkbox checked={!!field.value} onCheckedChange={value => field.onChange(value)} />
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
        <div className="rounded-lg shadow-xl w-[70%]">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-300 font-semibold text-black rounded-lg">
                {header.map(item => (
                  <TableCell key={item.title} className="text-black font-semibold">
                    {item.title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(dataCate) &&
                dataCate.length > 0 &&
                dataCate.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.slug}</TableCell>
                    <TableCell>
                      <span className={item.isActive ? 'text-green-500' : 'text-purple-500'}>
                        {item.isActive ? 'Đang hiển thị' : 'Đang ẩn'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setCate(item)}>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Pencil className="h-4 w-4" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Chỉnh sửa</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-50 rounded-2xl ">
                            <EditCate cate={cate} />
                          </DialogContent>
                        </Dialog>
                        <DialogDel id={item.id} handleDel={handleDel} />
                        {/* <Button variant="ghost" size="sm">
                          <Trash className="h-4 w-4" />
                        </Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;

const EditCate = ({ cate }: { cate: CategoryType }) => {
  const { data: session } = useSession();
  const form = useForm<CreateCategoryType>({
    resolver: zodResolver(CreateCategory),
    defaultValues: {
      name: cate.name,
      slug: cate.slug,
      description: cate.description,
      isActive: cate.isActive,
    },
  });
  const onSubmit = async (accessToken: string, values: CreateCategoryType) => {
    const res = await cateReq.updateCategory<IRes>(accessToken, values);
    if (res.statusCode === 200) {
      toast({
        title: 'Cập nhật thành công',
      });
    } else {
      toast({
        title: 'Cập nhật thất bại',
        description: res.message || res.error,
      });
    }
    // console.log(res);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(values => onSubmit(session.accessToken, values))}
        className="space-y-6 sm:space-y-8 w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>name</FormLabel>
              <FormControl>
                <Input placeholder="tên danh mục" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="slug" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>description</FormLabel>
              <FormControl>
                <Input placeholder="Mô tả" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3">
              <FormLabel>Hiển thị</FormLabel>
              <FormControl>
                <Checkbox checked={!!field.value} onCheckedChange={value => field.onChange(value)} />
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
  );
};
