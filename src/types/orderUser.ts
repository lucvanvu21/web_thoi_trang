import { z } from 'zod';

export const OrderProduct = z.object({
fullName: z.string(),
phone: z.string(),
address: z.string(),
note: z.string().optional(),
shippingCode: z.string().optional(),
totalPrice: z.number(),
PaymentMethod: z.string(),
orderItems: z.array(z.object({
  orderId: z.number(),
  variantId: z.string(),
  orderedPrice: z.number(),
  orderedQuantity: z.number(),
}))
});
export type OrderProductType = z.TypeOf<typeof OrderProduct>;
