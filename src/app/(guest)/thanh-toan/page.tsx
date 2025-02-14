import CheckoutCom from '@/components/checkout';
import { userReq } from '@/requestApi/user/userRequest';
import { UserType } from '@/types/indexType';
import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import React from 'react';

const CheckoutPage = async () => {
  const cities = await fetch('https://provinces.open-api.vn/api/', {
    cache: 'force-cache',
  }).then(res => res.json());
  const token = await getServerSession(authOptions);
  let user: UserType;
  if (token) {
    user = await userReq.getProfile<UserType>(token.accessToken);
  }
  return (
    <div>
      <CheckoutCom cities={cities} user={user} />
    </div>
  );
};

export default CheckoutPage;
