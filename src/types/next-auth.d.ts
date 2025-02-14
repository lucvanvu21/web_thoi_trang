import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// interface IUser {
//   id: number;
//   name: string
//   email: string
//   role: string,
//   accessToken: string,
//   refreshToken: string,
//   accessTokenExpires: number,
// }
declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    user: User;
    accessTokenExpires: number;
    error: string;
  }
  interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}

declare module 'next-auth' {
  interface Session {
    id: number;
    email: string;
    accessToken: string;
    refreshToken: string;
    role: string;
    accessTokenExpires: number;
    error: string;
  }
  interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}
