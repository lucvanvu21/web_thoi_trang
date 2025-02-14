import { z } from 'zod';

export const OrderStatus = z.object({
  orderStatus: z.enum(['processing', 'delivered', 'cancel', 'return', 'refund', 'delivering']),
  isPaid: z.boolean(),
  paidDate: z.string().optional(),
});
export type OrderStatusType = z.TypeOf<typeof OrderStatus>;
