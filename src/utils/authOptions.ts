// import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { http } from './actions';
import { jwtDecode } from 'jwt-decode';
// import { JWT } from 'next-auth/jwt';
import { NextAuthOptions } from 'next-auth';

// import { IUser } from '@/types/next-auth';
// import { AuthOptions } from 'next-auth';
interface DecodedToken {
  exp: number; // Thời gian hết hạn
  iat: number; // Thời gian phát hành
  // Các trường khác từ token của bạn
}
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const body = {
          email: credentials?.email,
          password: credentials?.password,
        };
        const res = await http.post<IBackendResponse<ILogin>>('/auth/login', {
          body,
        });
        console.log('res--->', res);
        // console.log('auth--->', res);
        if (res.statusCode === 201) {
          const decoded = jwtDecode<DecodedToken>(res.data.accessToken);
          return {
            id: Number(res.data.id),
            name: res.data.fullName,
            email: res.data.email,
            role: res.data.roles[0],
            accessToken: res.data.accessToken,
            refreshToken: res.data.refresh_token,
            accessTokenExpires: decoded.exp * 1000,
          };
        } else if (res.statusCode === 401) {
          throw new Error(res.message);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    // Lưu token vào JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires;
        // token.accessTokenExpires = Date.now() + 60 * 60 * 24 * 7 * 1000;
      }
      // console.log('token--->', token);
      // console.log('token',user)
      // console.log('jwt--->', Date.now(), token.accessTokenExpires);
      console.log('token--->', Date.now(), token.accessTokenExpires);
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      try {
        const res = await http.post<{ accessToken: string }>('/auth/refreshToken', {
          headers: { Authorization: `Bearer ${token.refreshToken}` },
        });
        console.log('res--->', res);  
        if ('accessToken' in res) {
          const decoded = jwtDecode<DecodedToken>(res.accessToken);
          console.log('decoded--->2', decoded);
          return {
            ...token,
            accessToken: res.accessToken,
            accessTokenExpires: decoded.exp * 1000, // Chuyển đổi sang mili giây
          };
        } else {
          return {
            ...token,
            accessTokenExpires: 0,
            error: 'RefreshAccessTokenError',
          };
        }
      } catch (error) {
        console.error('Refresh token error:', error);
        return {
          ...token,
          accessTokenExpires: 0,
          error: 'RefreshAccessTokenError',
        };
      }
      return token;
    },

    async session({ session, token }) {
      // console.log('session--->', session, token);
      if (token) {
        session.id = token.id as number;
        session.email = token.email;
        session.role = token.role as string;
        session.accessToken = token.accessToken;
        session.accessTokenExpires = token.accessTokenExpires;
        // session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // url: process.env.NEXTAUTH_URL,
};

// export default NextAuth(authOptions)
