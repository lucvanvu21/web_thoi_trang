import z from 'zod';
export const LoginBody = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
  password: z.string().min(4, { message: 'Mật khẩu phải có ít nhất 4 ký tự' }),
});
export type LoginBodyType = z.TypeOf<typeof LoginBody>;
export const RegisterBody = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
  name: z.string(),
  password: z.string().min(4, { message: 'Mật khẩu phải có ít nhất 4 ký tự' }),
});
export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;
export const UpdateUser = z.object({
  phone: z.string(),
  fullName: z.string(),
  address: z.string(),
});
export type UpdateUserType = z.TypeOf<typeof UpdateUser>;
