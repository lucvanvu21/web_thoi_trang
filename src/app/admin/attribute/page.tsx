import AtributePage from '@/components/admin/atributePage';
import { attributeReq } from '@/requestApi/attribute/atributeReq';
import { AttributeType } from '@/types/indexType';
import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import React from 'react';

const Attribute = async () => {
  const session = await getServerSession(authOptions);
  const res = await attributeReq.getAll<AttributeType[]>(session?.accessToken);
  // console.log(res);
  if (!Array.isArray(res)) return <>Loading.... ---- {JSON.stringify(res)}</>;
  return (
    <>
      <AtributePage dataAtt={res} />
    </>
  );
};

export default Attribute;
