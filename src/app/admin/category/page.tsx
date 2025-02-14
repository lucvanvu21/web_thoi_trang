import CategoryPage from '@/components/admin/categoryPage';
import { cateReq } from '@/requestApi/category/cateReq';
import { CategoryType } from '@/types/indexType';
import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';

const Category = async () => {
  const session = await getServerSession(authOptions);
  const res = await cateReq.getAll<CategoryType[]>(session?.accessToken);
  // console.log('res------>', res);
  return (
    <div>
      <CategoryPage dataCate={res} />
    </div>
  );
};

export default Category;
