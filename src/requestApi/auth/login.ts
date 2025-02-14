// import { http } from "@/utils/actions";

// export const userRequestApi = {
//       signIn: async (credentials: { username: string, password: string }) => {
//         return http.post(`/api/auth/login`, credentials);
//       }
// }
import { RegisterBodyType } from '@/types/authSchema';
import { http } from '@/utils/actions';
import { signIn } from 'next-auth/react';

export const authenticate = async (email: string, password: string) => {
  try {
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    // console.log('res---authen', res);
    return res;
  } catch (error) {
    return error;
  }
};
export const registerApi = async (values: RegisterBodyType) => {
  const body = {
    email: values.email,
    password: values.password,
    // name: values.name,
  };
  return http.post<IBackendResponse<any>>(`/auth/register`, { body });
};
export const logoutApi = async (accessToken: string) => {
  // console.log('accessToken', accessToken);
  return http.post<IBackendResponse<any>>(
    `/auth/logout`,
    // { accessToken },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};
