'use client';
import { AttributeType } from '@/types/indexType';
import { useSession } from 'next-auth/react';
import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { AttributeValueBodyType, CreateAttribute, CreateAttributeType } from '@/types/categorySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { attributeReq } from '@/requestApi/attribute/atributeReq';
import { toast } from '@/hooks/use-toast';
import { Card } from '../ui/card';
import { Pencil, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import DialogDel from '../dialogDel';
import { Dialog, DialogContent } from '../ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
const AtributePage = ({ dataAtt }: { dataAtt: AttributeType[] }) => {
  // console.log(dataAtt);
  const { data: session } = useSession();
  const [isOpen, setOpen] = React.useState(false);
  const [selectedAttr, setSelctedAttr] = React.useState(undefined);
  const [isAddingValue, setIsAddingValue] = React.useState(false);
  const [isUpdateValue, setIsUpdateValue] = React.useState(false);
  const [selectedId, setSelctedId] = React.useState<number | undefined>(undefined);
  const onSubmit = async (accessToken: string, values: CreateAttributeType) => {
    const res = await attributeReq.createAttribute<IRes>(accessToken, values);
    if (res.statusCode === 201) {
      toast({
        title: 'Thêm thành công',
      });
    } else {
      toast({
        title: 'Thêm thất bại',
        description: res.message || res.error,
      });
    }
  };
  const handleDelAttr = async (id: number) => {
    const res = await attributeReq.deleteAttribute<IRes>(session?.accessToken, id);
    if (res.statusCode === 200) {
      toast({
        title: 'Xóa thành công',
        description: res.message,
      });
    } else {
      toast({
        title: 'Xóa thất bại',
        description: res.message || res.error,
      });
    }
  };
  const onSubmitUpdate = async (accessToken: string, values: CreateAttributeType, id: number) => {
    console.log(id);
    const res = await attributeReq.updateAttribute<IRes>(accessToken, values, id);
    if (res.statusCode === 200) {
      toast({
        title: 'Cập nhật thành công',
      });
      setOpen(false);
    } else {
      toast({
        title: 'Cập nhật thất bại',
        description: res.message || res.error,
      });
    }
  };
  const onSubmitAddValue = async (accessToken: string, values: CreateAttributeType, id: number) => {
    // console.log(values);
    const body: AttributeValueBodyType = {
      value: values.name,
      attribute: {
        id: Number(id),
      },
    };
    const res = await attributeReq.createAttValue<IRes>(accessToken, body);
    // console.log(res);
    if (res.statusCode === 201) {
      toast({
        title: 'Thêm thành công',
      });

      setOpen(false);
    } else {
      toast({
        title: 'Thêm thất bại',
        description: res.message || res.error,
      });
    }
  };
  const onSubmitUpdateValue = async (accessToken: string, values: AttributeType, id: number) => {
    // console.log(values);
    const body = {
      value: values.name,
      attribute: {
        id: Number(selectedId),
      },
    };
    console.log(body, values);
    const res = await attributeReq.updateAttValue<IRes>(accessToken, body, id);
    console.log(res);
    if (res.statusCode === 200) {
      toast({
        title: 'Cập nhật thành công',
      });
      setOpen(false);
    } else {
      toast({
        title: 'Cập nhật thất bại',
        description: res.message || res.error,
      });
    }
  };
  const handleDelAttrValue = async (id: number) => {
    const res = await attributeReq.delAttrValue<IRes>(session?.accessToken, id);
    if (res.statusCode === 200) {
      toast({
        title: 'Xóa thành công',
        description: res.message,
      });
    } else {
      toast({
        title: 'Xóa thất bại',
        description: res.message || res.error,
      });
    }
  };
  // console.log(dataAtt);
  return (
    <div className="p-6">
      <div>
        <FormAtt onSubmit={onSubmit} accessToken={session?.accessToken} />
      </div>
      <div className="flex gap-6 my-6">
        {Array.isArray(dataAtt) &&
          dataAtt.length > 0 &&
          dataAtt.map(item => (
            <Card key={item.id} className="p-4 min-w-[220px] m-w-[20%] shadow-md h-fit ">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger
                        onClick={() => {
                          setOpen(true);
                          setSelctedAttr(item);
                          setIsAddingValue(true);
                        }}
                      >
                        <Button variant="ghost" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Thêm giá trị</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger
                        onClick={() => {
                          setOpen(true);
                          setSelctedAttr(item);
                          setIsAddingValue(false);
                          setIsUpdateValue(false);
                        }}
                      >
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Chỉnh sửa thuộc tính</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Dialog open={isOpen} onOpenChange={setOpen}>
                    <DialogContent className="bg-slate-50 rounded-2xl ">
                      {/* <h2 className="text-center text-2xl">Thêm giá trị</h2> */}
                      <FormAtt
                        onSubmit={isAddingValue ? onSubmitAddValue : isUpdateValue ? onSubmitUpdateValue : onSubmitUpdate}
                        accessToken={session?.accessToken}
                        data={selectedAttr}
                        isValue={isAddingValue || isUpdateValue}
                      />
                    </DialogContent>
                  </Dialog>
                  <DialogDel id={item?.id} handleDel={handleDelAttr} />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black">TÊN</TableHead>
                    <TableHead className="text-black">HÀNH ĐỘNG</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {item.attributeValues.map(value => (
                    <TableRow key={value.id}>
                      <TableCell>{value.value}</TableCell>
                      <TableCell className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              onClick={() => {
                                setOpen(true);
                                setSelctedAttr(value);
                                setIsUpdateValue(true);
                                setIsAddingValue(false);
                                setSelctedId(item.id);
                              }}
                            >
                              <Button variant="ghost" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Chỉnh sửa giá trị</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <DialogDel id={value?.id} handleDel={handleDelAttrValue} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default AtributePage;
const FormAtt = ({
  onSubmit,
  accessToken,
  data,
  isValue,
}: {
  onSubmit: (accessToken: string, value: CreateAttributeType | AttributeValueBodyType, id?: number) => void;
  accessToken: string;
  data?: any;
  isValue?: boolean;
}) => {
  console.log(data);
  const form = useForm<CreateAttributeType>({
    resolver: zodResolver(CreateAttribute),
    defaultValues: {
      name: isValue ? data?.value || '' : data?.name,
    },
  });
  // useEffect(() => {
  //   form.reset({ name: data?.name || '' }); // Reset form khi data thay đổi
  // }, [data, form]);
  // console.log(data);
  return (
    <>
      <h2 className="text-center text-2xl">Form {isValue ? 'giá trị' : 'thuộc tính'}</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(values => {
            onSubmit(accessToken, values, data?.id);
          })}
          className="space-y-6 sm:space-y-8 w-full flex gap-2 "
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-fit">
                <FormLabel>{isValue ? 'Giá trị' : 'Thuộc tính'}</FormLabel>
                <FormControl>
                  <Input placeholder={isValue ? 'Giá trị' : 'thuộc tính'} type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className=" bg-black text-white hover:bg-black/80 rounded-xl">
            {data ? 'Cập nhật' : 'Thêm'}
          </Button>
        </form>
      </Form>
    </>
  );
};
