import { z } from 'zod';

export const ProductBody = z.object({
  name: z.string().min(1, { message: 'Tên không được để trống' }),
  slug: z.string().min(1, { message: 'Slug không được để trống' }),
  description: z.string().optional(),
  category: z.object({
    id: z.number().min(1, { message: 'ID danh mục không hợp lệ' }),
    name: z.string().min(1, { message: 'Tên danh mục không hợp lệ' }),
  }), 

  variants: z
    .array(
      z.object({
        price: z.number().min(0, 'Giá không hợp lệ'),
        quantity: z.number().min(0, 'Số lượng không hợp lệ'),
        attributeValues: z.array(z.any()), // Nếu có kiểu cụ thể, thay `z.any()` bằng `z.string()` hoặc `z.object({...})`
      })
    )
    .optional(),

  isNew: z.boolean().default(false),
  isActive: z.boolean().default(false),
  isPopular: z.boolean().default(false),

  price: z.number().min(0, 'Giá sản phẩm không hợp lệ').optional(),
  quantity: z.number().min(0, 'Số lượng sản phẩm không hợp lệ').optional(),

  image1: z.any(),
  image2: z.any().optional(), // Cho phép bất kỳ kiểu dữ liệu nào hoặc `undefined`
  image3: z.any().optional(), // Cho phép bất kỳ kiểu dữ liệu nào hoặc `undefined`
  image4: z.any().optional(), // Cho phép bất kỳ kiểu dữ liệu nào hoặc `undefined`
  image5: z.any().optional(), // Cho phép bất kỳ kiểu dữ liệu nào hoặc `undefined`
  image6: z.any().optional(), // Cho phép bất kỳ kiểu dữ liệu nào hoặc `undefined`
  image7: z.any().optional(),
});

export type ProductBodyType = z.TypeOf<typeof ProductBody>;
