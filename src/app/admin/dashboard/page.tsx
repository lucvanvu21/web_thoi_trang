import DashboardCom, { ThongKeBanHangType } from '@/components/admin/dashboard';
import { dashboardReq } from '@/requestApi/dashboard/dashboardReq';
import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';

const DashboardPage = async () => {
  // console.log('dashboard');
  const token = await getServerSession(authOptions);
  // console.log('token---->', token);
  const thongKeBanHang = await dashboardReq.getThongKeBanHang<ThongKeBanHangType[]>(token?.accessToken);
  const tongDoanhThu = await dashboardReq.tongDoanhThu<{ totalRevenue: number }>(token?.accessToken);
  const overview = await dashboardReq.getOverview<
    {
      orderStatus: string;
      total: string;
    }[]
  >(token?.accessToken);
  const topSellingProducts = await dashboardReq.getTopSellingProducts<
    {
      name: string;
      sold: string;
    }[]
  >(token?.accessToken);
  const totalOrder = await dashboardReq.totalOrder<number>(token?.accessToken);
  const totalProduct = await dashboardReq.totalProduct<number>(token?.accessToken);
  console.log('totalProduct->', totalProduct);
  // console.log('token->', token);
  return (
    <div>
      <h1 className="text-3xl mb-2 font-semibold">Thống kê</h1>
      <DashboardCom
        thongKeBanHang={thongKeBanHang}
        tongDoanhThu={tongDoanhThu}
        overview={overview}
        topSellingProducts={topSellingProducts}
        totalOrder={totalOrder}
        totalProduct={totalProduct}
      />
    </div>
  );
};

export default DashboardPage;
