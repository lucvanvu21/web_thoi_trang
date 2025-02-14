'use client';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';
import { productReq } from '@/requestApi/product/productReq';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select as CustomSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import Select from 'react-select';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { ProductBody, ProductBodyType } from '@/types/productSchema';
import { Card } from '../ui/card';
import Image from 'next/image';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryType, ImageType, ProductType } from '@/types/indexType';
import { cateReq } from '@/requestApi/category/cateReq';
import { Textarea } from '../ui/textarea';
import { attributeReq } from '@/requestApi/attribute/atributeReq';
import slugify from 'react-slugify';
import { Dialog, DialogContent } from '../ui/dialog';

const fileToBase64 = (file: File) => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
  });
};
function instanceOfImageType(object: any): object is ImageType {
  return 'publicId' in object;
}
const uploadImg = async (img: File) => {
  if (!img) return;
  const b64 = await fileToBase64(img);
  const res = await fetch('/api/cloudinary', {
    method: 'POST',
    body: JSON.stringify({ image: b64 }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  return data;
};
const deleteImg = async (imgId: string) => {
  const res = await fetch('/api/cloudinary', {
    method: 'DELETE',
    body: JSON.stringify({ id: imgId }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  // console.log('deleteImg----->', data);
  return data;
};
const FormProduct = ({
  isOpen,
  setIsOpen,
  dataProduct,
}: {
  isOpen: boolean;
  setIsOpen: (boolean: boolean) => void;
  dataProduct?: ProductType;
}) => {
  // console.log('render Add', dataProduct);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const form = useForm<ProductBodyType>({
    resolver: zodResolver(ProductBody),
    // defaultValues: dataProduct,
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      category: {
        id: 0,
        name: '',
      },
      variants: [
        {
          price: 0,
          quantity: 0,
          attributeValues: [],
        },
      ],
      isNew: dataProduct?.isNew || false,
      isActive: dataProduct?.isActive || false,
      isPopular: dataProduct?.isPopular || false,
      image1: undefined,
      image2: undefined,
      image3: undefined,
      image4: undefined,
      image5: undefined,
      image6: undefined,
      image7: undefined,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'variants',
  });
  const [isVariants, setIsVariants] = useState(dataProduct?.variants?.length > 0 ? true : false);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [adding, setAdding] = useState(dataProduct ? false : true);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  useEffect(() => {
    const fetchCate = async () => {
      try {
        const res = await cateReq.getAll<CategoryType[]>(session?.accessToken);
        // const data = await response.json();
        if (Array.isArray(res)) {
          setCategories(res);
        } else {
          console.error('Failed to fetch category:', res);
        }
      } catch (error) {
        console.error('Failed to fetch category:', error);
      }
    };
    fetchCate();
  }, []);
  useEffect(() => {
    if (dataProduct) {
      form.setValue('name', dataProduct?.name);
      form.setValue('slug', dataProduct?.slug);
      form.setValue('category', {
        name: dataProduct?.category.name,
        id: dataProduct.category.id,
      });
      form.setValue('description', dataProduct?.description);
      form.setValue('image1', dataProduct?.images[0]);
      form.setValue('image2', dataProduct?.images[1]);
      form.setValue('image3', dataProduct?.images[2]);
      form.setValue('image4', dataProduct?.images[3]);
      form.setValue('image5', dataProduct?.images[4]);
      form.setValue('image6', dataProduct?.images[5]);
      form.setValue('image7', dataProduct?.images[6]);

      if (dataProduct.variants.length === 1 && dataProduct.variants[0].attributeValues.length === 0) {
        setIsVariants(false);
        setPrice(dataProduct.variants[0].price);
        setQuantity(dataProduct.variants[0].quantity);
        form.setValue('variants', [
          {
            price: 0,
            quantity: 0,
            attributeValues: [],
          },
        ]);
      } else {
        setIsVariants(true);
        const newVariants = dataProduct.variants.map(i => {
          i.attributeValues = i.attributeValues.map(a => ({
            ...a,
            label: a.value,
          }));
          return i;
        });
        form.setValue('variants', newVariants);
      }
    }
  }, [dataProduct]);

  const resetForm = () => {
    form.reset();
    setPrice(0);
    setQuantity(0);
  };

  console.log('cate', dataProduct);
  const uploadImgsToCloud = async () => {
    const images: File[] = [];
    form.getValues('image1') && images.push(form.getValues('image1')[0]);
    form.getValues('image2') && images.push(form.getValues('image2')[0]);
    form.getValues('image3') && images.push(form.getValues('image3')[0]);
    form.getValues('image4') && images.push(form.getValues('image4')[0]);
    form.getValues('image5') && images.push(form.getValues('image5')[0]);
    form.getValues('image6') && images.push(form.getValues('image6')[0]);
    form.getValues('image7') && images.push(form.getValues('image7')[0]);

    // console.log('images----->',images);
    return await Promise.all(images.map((img: File) => uploadImg(img)));
  };

  const updateImages = async (data: ProductBodyType) => {
    if (!dataProduct) return;
    return (
      await Promise.all(
        [...new Array(7)].map(async (item, index) => {
          if (
            dataProduct.images[index] &&
            form.getValues(`image${index + 1}` as keyof ProductBodyType) instanceof FileList &&
            (form.getValues(`image${index + 1}` as keyof ProductBodyType) as FileList).length > 0
          ) {
            const img = (form.getValues(`image${index + 1}` as keyof ProductBodyType) as FileList)[0];
            const resUploaded = await uploadImg(img); // upload new img to cloud
            await deleteImg(dataProduct?.images[index].publicId); // delete old img in cloud
            const newImg = {
              id: dataProduct.images[index].id,
              publicId: resUploaded.public_id,
              url: resUploaded.secure_url,
            };
            return newImg;
          } else if (
            !dataProduct.images[index] &&
            form.getValues(`image${index + 1}` as keyof ProductBodyType) instanceof FileList &&
            (form.getValues(`image${index + 1}` as keyof ProductBodyType) as FileList).length > 0
          ) {
            const img = (form.getValues(`image${index + 1}` as keyof ProductBodyType) as FileList)[0];
            const resUploaded = await uploadImg(img); // upload new img to cloud
            const newImg = {
              publicId: resUploaded.public_id,
              url: resUploaded.secure_url,
            };
            return newImg;
          } else if (
            form.getValues(`image${index + 1}` as keyof ProductBodyType) &&
            instanceOfImageType(form.getValues(`image${index + 1}` as keyof ProductBodyType))
          ) {
            // images.push(form.getValues(`image${index + 1}` as keyof ProductBodyType));
            return form.getValues(`image${index + 1}` as keyof ProductBodyType);
          } else if (
            dataProduct.images[index] &&
            form.getValues(`image${index + 1}` as keyof ProductBodyType) instanceof FileList &&
            (form.getValues(`image${index + 1}` as keyof ProductBodyType) as FileList).length == 0
          ) {
            await deleteImg(dataProduct?.images[index].publicId); // delete old img in cloud
            return undefined;
          }
        })
      )
    ).filter(i => i !== undefined);
  };
  const checkImgsEmpty = () => {
    if (
      !form.getValues('image1') &&
      !form.getValues('image2') &&
      !form.getValues('image3') &&
      !form.getValues('image4') &&
      !form.getValues('image5') &&
      !form.getValues('image6') &&
      !form.getValues('image7')
    ) {
      return true;
    }
    return false;
  };

  const onSubmit: SubmitHandler<ProductBodyType> = async data => {
    console.log('->dataform------>', data);
    setLoading(true);
    if (!data.variants.length) return;

    const category = { id: data.category.id };

    // Check if product have multi variant
    let variants: any = [{ price, quantity, attributeValues: [] }];
    let noAttributes = false;
    if (isVariants) {
      variants = data.variants.map(i => {
        if (i.attributeValues.length === 0) {
          noAttributes = true;
        }

        const newAtt = i.attributeValues.map((a: any) => ({ id: a.id }));
        return {
          ...i,
          attributeValues: newAtt,
        };
      });

      if (noAttributes) {
        toast({
          title: 'Phiên bản phải có ít nhất 1 thuộc tính',
          variant: 'destructive',
        });
        return;
      }
    }

    if (checkImgsEmpty()) {
      toast({
        title: 'Sản phẩm phải có ít nhất 1 hình ảnh',
        variant: 'destructive',
      });
      return;
    }

    try {
      let images;
      if (dataProduct) {
        images = await updateImages(data);
      } else {
        const resUploaded = await uploadImgsToCloud();
        images = resUploaded.map((d: any) => ({
          publicId: d.public_id,
          url: d.secure_url,
        }));
      }

      // Remove unnecessary attributes
      const { image1, image2, image3, image4, image5, image6, image7, price, quantity, ...newData } = data;
      const postData = { ...newData, category, variants, images: images };
      // console.log('postData----->', postData);
      const res = adding
        ? await productReq.addProduct<ProductType>(postData, session?.accessToken)
        : await productReq.updateProduct<ProductType>(dataProduct.id, postData, session?.accessToken);
      // console.log('res-----> create', res);
      if (res.error) {
        toast({
          title: res.error,
          description: res.message || 'Có lỗi xảy ra',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      } else {
        toast({
          title: adding ? 'Tạo thành công!' : 'Cập nhật thành công!',
        });
        setLoading(false);
        setIsOpen(false);
      }
      resetForm();
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        toast({
          title: error.response.data.message,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      toast({
        title: 'Cập nhật thất bại',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
    } finally {
      // setAdding(false);
    }
  };

  console.log(form.formState.errors);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[85vh] overflow-y-auto max-w-fit">
        <div className="mx-6 w-11/12">
          <h1 className="text-2xl font-bold mt-5">Thêm sản phẩm</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(values => onSubmit(values))}
              className="space-y-2 sm:space-y-4 min-w-[1024px] flex gap-8"
            >
              <div className="w-2/5">
                <div>
                  <Card className="w-[390px] h-[390px]">
                    <ImagePreview
                      getValues={form.getValues}
                      watch={form.watch}
                      control={form.control}
                      name="image1"
                      defaultValue={form.getValues('image1.url')}
                    />
                  </Card>
                </div>
                <div className="flex gap-3 mt-3 flex-wrap">
                  {[...Array(6)].map((i, index) => (
                    <Card key={index + 2}>
                      <ImagePreview
                        getValues={form.getValues}
                        watch={form.watch}
                        control={form.control}
                        name={`image${index + 2}`}
                        small
                        defaultValue={form.getValues(`image${index + 2}` as keyof ProductBodyType)?.url}
                      />
                    </Card>
                  ))}
                </div>
              </div>
              <div className="w-3/5 ">
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Tên sản phẩm</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="tên sản phẩm"
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Danh mục</FormLabel>
                        <FormControl>
                          <CustomSelect
                            onValueChange={value => {
                              const selectedCategory = categories.find(cate => cate.id.toString() === value);
                              field.onChange({ id: Number(value), name: selectedCategory.name });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={dataProduct?.category?.name || 'Chọn danh mục'} />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.isArray(categories) &&
                                categories.length > 0 &&
                                categories?.map(cate => (
                                  <SelectItem key={cate.id} value={cate.id.toString()}>
                                    {cate.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </CustomSelect>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="w-full">
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
                    <FormItem className="w-full">
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Mô tả" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center space-x-2 my-2">
                  <Checkbox id="terms" onCheckedChange={checked => setIsVariants(checked === true)} checked={isVariants} />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Có nhiều loại
                  </label>
                </div>

                {isVariants ? (
                  <div className="space-y-4 ">
                    {fields.map((field, index) => (
                      <div key={field.id} className="p-4 rounded-lg space-x-4 flex items-end ">
                        <Controller
                          name={`variants.${index}.attributeValues`}
                          control={form.control}
                          render={({ field }) => (
                            <AttributeSelect
                              label="Thuộc tính"
                              placeholder="Chọn thuộc tính"
                              value={field.value}
                              onChange={field.onChange}
                              innerRef={field.ref}
                            />
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Giá</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Nhập giá (VND)"
                                  {...field}
                                  value={field.value || ''}
                                  onChange={e => field.onChange(+e.target.valueAsNumber)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`variants.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số lượng</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Nhập số lượng"
                                  {...field}
                                  value={field.value || ''}
                                  onChange={e => field.onChange(+e.target.valueAsNumber)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="button" variant="destructive" onClick={() => remove(index)}>
                          Xóa
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => append({ price: 0, quantity: 0, attributeValues: [] })}
                    >
                      Thêm biến thể
                    </Button>
                  </div>
                ) : (
                  <div className=" p-4 rounded-lg space-x-4 flex w-full">
                    <div className="w-full">
                      <label>Giá</label>
                      <Input type="text" onChange={e => setPrice(+e.target.value)} value={price} />
                    </div>
                    <div className="w-full">
                      <label>Số lượng</label>
                      <Input type="text" onChange={e => setQuantity(+e.target.value)} value={quantity} />
                    </div>
                  </div>
                )}
                <div className="w-full flex justify-center mt-5 gap-5">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-end space-x-3">
                        <FormLabel htmlFor="isActive" className="cursor-pointer">
                          Hiển thị
                        </FormLabel>
                        <FormControl>
                          <Checkbox
                            id="isActive"
                            checked={field.value}
                            onCheckedChange={value => field.onChange(value as boolean)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isNew"
                    render={({ field }) => (
                      <FormItem className="flex space-x-3 items-end">
                        <FormLabel htmlFor="isNew" className="cursor-pointer">
                          Mới
                        </FormLabel>
                        <FormControl>
                          <Checkbox
                            id="isNew"
                            className="m-0"
                            checked={field.value}
                            onCheckedChange={value => field.onChange(value as boolean)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPopular"
                    render={({ field }) => (
                      <FormItem className="flex items-end space-x-3">
                        <FormLabel htmlFor="isPopular" className="cursor-pointer">
                          Nổi bật
                        </FormLabel>
                        <FormControl>
                          <Checkbox
                            id="isPopular"
                            checked={field.value}
                            onCheckedChange={value => field.onChange(value as boolean)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {loading ? (
                  <div>Loading ....</div>
                ) : (
                  <Button type="submit" className="w-full my-2">
                    {adding ? 'Thêm sản phẩm' : 'Cập nhật sản phẩm'}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormProduct;
const ImagePreview = ({ small, control, name, watch, defaultValue }: any) => {
  const file = watch(name);
  // console.log('file----->', file);
  let url = '';
  if (file && file[0]) {
    url = URL.createObjectURL(file[0]);
  } else {
    url = defaultValue || '/placeholder.png';
  }
  return (
    <div className="relative w-full h-full">
      {/* Upload Button */}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange } }) => (
          <div className="absolute right-2 top-2  cursor-pointer z-20">
            <Button
              variant="ghost"
              size="icon"
              className={cn('bg-white shadow-md rounded-full ', small ? 'w-8 h-8' : 'w-16 h-16')}
            >
              <Pencil className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                className=" absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const fileSizeMB = file.size / 1024 / 1024;
                    if (fileSizeMB > 1) {
                      toast({ title: 'Hình ảnh vượt quá 1MB', variant: 'destructive' });
                      return;
                    }
                    onChange(e.target.files);
                  }
                }}
              />
            </Button>
          </div>
        )}
      />

      {/* Image Preview */}
      <div className={cn('rounded-md overflow-hidden relative', small ? 'w-20 h-20' : 'w-full h-full')}>
        <Image src={url} alt="Preview" fill className="object-cover rounded-xl" />
      </div>
    </div>
  );
};
type AttributeOption = {
  label: string;
  options: {
    label: string;
    id: number;
    value: string;
    attributes: {
      id: number;
      name: string;
    };
  }[];
}[];
const AttributeSelect = (props: any) => {
  const { data: session } = useSession();

  const [attributes, setAttributes] = useState<any>(null);

  const [originalOptions, setOriginalOptions] = useState<AttributeOption>([]);
  const [options, setOptions] = useState<AttributeOption>([]);
  useEffect(() => {
    const fetchAtt = async () => {
      try {
        const res = await attributeReq.getAll(session?.accessToken);
        setAttributes(res);
      } catch (error) {
        console.error('Failed to fetch attributes:', error);
      }
    };
    fetchAtt();
  }, []);
  useEffect(() => {
    if (attributes) {
      const newAttributes = attributes?.map(i => {
        const attributeValues = i.attributeValues.map(a => ({
          ...a,
          label: a.value,
        }));

        return {
          label: i.name,
          options: attributeValues,
        };
      });
      setOriginalOptions(newAttributes);
      setOptions(newAttributes);
    }
  }, [attributes]);

  const handleChange = (selectedOption: any) => {
    props.onChange(selectedOption);

    // if selection of a group is selected then remove that group
    let newGroupedOptions = [];
    newGroupedOptions = originalOptions?.filter((e: any) => {
      const found = e.options.find((k: any) => {
        const res = selectedOption.find((i: any) => i.value === k.value);
        return res ? true : false;
      });

      return found ? false : true;
    });

    setOptions(newGroupedOptions);
  };

  return (
    <div style={{ width: '100%' }}>
      <label style={{ fontSize: 14, marginBottom: 6, display: 'block' }}>Chọn thuộc tính</label>
      {attributes && (
        <Select
          {...props}
          // menuPortalTarget={document.querySelector('body')}
          // menuPortalTarget={document.body}
          // menuShouldBlockScroll={true}
          // menuPosition={'fixed'}
          options={options}
          onChange={handleChange}
          isMulti
          closeMenuOnSelect={false}
          styles={{
            container: base => ({
              ...base,
              width: '100%',
            }),
            control: base => ({
              ...base,
              background: '#F1F3F5',
              border: 'none',
              borderColor: 'none',
              borderRadius: 12,
              minHeight: 40,
              boxShadow: 'none',
            }),
            menu: base => ({
              ...base,
              background: '#fff',
              fontSize: 14,
              borderRadius: 12,
              overflow: 'hidden',
              minWidth: 360,
            }),
            menuList: base => ({
              ...base,
            }),
            valueContainer: base => ({
              ...base,
              fontSize: 14,
            }),
            option: (styles: any, { isSelected }: any) => ({
              ...styles,
              backgroundColor: isSelected ? '#bd1c0e' : null,
              color: isSelected ? 'white' : null,
              ':hover': {
                backgroundColor: isSelected ? null : '#EADCF8',
                color: isSelected ? null : '#bd1c0e',
              },
              ':active': {
                backgroundColor: null,
                color: null,
              },
            }),
          }}
        />
      )}
    </div>
  );
};
