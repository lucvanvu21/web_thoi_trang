import React from 'react';
import { columns } from './column';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { userReq } from '@/requestApi/user/userRequest';
import TableProduct from '@/components/admin/tableProduct';
import { UserPaginateType, UserType } from '@/types/indexType';

const UserPage = async ({ searchParams }: { searchParams: { page: number; name: string } }) => {
  const page = searchParams.page || 1
  const name = searchParams.name
  const token = await getServerSession(authOptions);
  const res = await userReq.getAll<UserPaginateType>(token.accessToken, page, name);
  console.log('data:---->', res);
  return (
    <div>
      <TableProduct<UserType> dataProduct={res.items} columns={columns} paginate={res.meta} product={false} user={true} />
    </div>
  );
};

export default UserPage;
