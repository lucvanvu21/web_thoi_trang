'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { CircleDollarSign, Package2, PackageOpen } from 'lucide-react';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { OrderColumns, orderStatus } from '@/app/admin/order/orderColumn';
import TableProduct from './tableProduct';
import { OrderPaginateType, OrderType } from '@/types/indexType';
import { useEffect, useState } from 'react';
import { orderReq } from '@/requestApi/order/orderReq';
import { useSession } from 'next-auth/react';
ChartJS.register(ArcElement, Tooltip, Legend);
const Overview = ({ overview }: { overview: { orderStatus: string; total: string }[] }) => {
  const defaultConfigs = [
    {
      orderStatus: 'cancel',
      total: '0',
    },
    {
      orderStatus: 'delivered',
      total: '0',
    },
    {
      orderStatus: 'processing',
      total: '0',
    },
    {
      orderStatus: 'refund',
      total: '0',
    },
    {
      orderStatus: 'delivering',
      total: '0',
    },
    {
      orderStatus: 'return',
      total: '0',
    },
  ];
  overview &&
    overview.forEach(o => {
      const index = defaultConfigs.findIndex(d => d.orderStatus === o.orderStatus);
      defaultConfigs[index].total = o.total;
    });
  const labels = defaultConfigs.map(o => orderStatus(o.orderStatus));
  const values = defaultConfigs.map(o => o.total);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Doughnut
      options={{
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              boxHeight: 8,
            },
          },
        },
      }}
      data={data}
    />
  );
};
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);
const ThongKeBanHang = ({ thongKeBanHang }) => {
  const colors = [
    {
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.2)',
    },
    {
      borderColor: 'rgb(255, 159, 64)',
      backgroundColor: 'rgba(255, 159, 64, 0.2)',
    },
  ];
  let datasets: any = [];
  thongKeBanHang?.forEach(s => {
    const label = s.method;
    const result = datasets.find((d: any) => d.label === label);
    if (!result) {
      datasets.push({
        fill: true,
        label,
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      });
    }
  });
  datasets = datasets.map((d: any, i: number) => ({ ...d, ...colors[i] }));

  thongKeBanHang?.forEach(s => {
    const label = s.method;
    const index = datasets.findIndex((d: any) => d.label === label);
    if (index !== -1) {
      datasets[index].data[s.month - 1] = s.total;
    }
  });

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => {
            return value.toLocaleString('vi-VN') + 'đ';
          },
        },
      },
    },

    interaction: {
      mode: 'index' as const,
      intersect: false,
    },

    tension: 0.4,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        align: 'start' as 'start',
        labels: {
          usePointStyle: true,
          boxHeight: 8,
        },
      },
    },
  };

  const labels = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];

  const data = {
    labels,
    datasets,
  };
  return <Line options={options} data={data} />;
};
export type ThongKeBanHangType = {
  month: number;
  total: number;
  method: string;
};
type PropsType = {
  thongKeBanHang: ThongKeBanHangType[];
  tongDoanhThu: {
    totalRevenue: number;
  };
  overview: {
    orderStatus: string;
    total: string;
  }[];
  topSellingProducts: {
    name: string;
    sold: string;
  }[];
  totalOrder: number;
  totalProduct: number;
};

const DashboardCom = ({ thongKeBanHang, tongDoanhThu, overview, topSellingProducts, totalOrder, totalProduct }: PropsType) => {
  // console.log('thongKeBanHang->', totalProduct);
  const [orderTable, setOrderTable] = useState<OrderPaginateType>(null);
  const { data: session } = useSession();
  useEffect(() => {
    const fetchData = async () => {
      // console.log('session.accessToken->', session);
      const res = await orderReq.getAll<OrderPaginateType>(1, session?.accessToken);
      // console.log('ress->', res);
      setOrderTable(res);
    };
    fetchData();
  }, [session]);
  // console.log(orderTable);
  return (
    <div className="p-0">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex items-center justify-center border-gray-400 shadow-lg">
          <div>
            <CircleDollarSign size={40} />
          </div>
          <div>
            <CardHeader className="pb-1">
              <CardTitle className="text-lg text-gray-600">Tổng doanh thu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {tongDoanhThu && Number(tongDoanhThu.totalRevenue).toLocaleString('vi-VN')} VNĐ
              </p>
            </CardContent>
          </div>
        </Card>
        <Card className="flex items-center justify-center border-gray-400 shadow-lg">
          <div>
            <PackageOpen size={40} />
          </div>
          <div>
            <CardHeader className="pb-1">
              <CardTitle className="text-lg text-gray-600">Tổng đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalOrder && Number(totalOrder)}</p>
            </CardContent>
          </div>
        </Card>
        <Card className="flex items-center justify-center border-gray-400 shadow-lg">
          <div>
            <Package2 size={40} />
          </div>
          <div>
            <CardHeader className="pb-1">
              <CardTitle className="text-lg text-gray-600">Tổng sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalProduct && Number(totalProduct)}</p>
            </CardContent>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex gap-3 ">
        <Card className="min-w-[55%] max-w-[55%]">
          <CardHeader>
            <CardTitle>Thống kê bán hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <ThongKeBanHang thongKeBanHang={thongKeBanHang} />
          </CardContent>
        </Card>
        <Card className='max-w-[25%]'>
          <CardHeader>
            <CardTitle>Tổng quan đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview overview={overview} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent>
            {topSellingProducts.map((product, index) => (
              <div key={index} className="flex justify-between py-2 border-b border-gray-400">
                <p>{product.name}</p>
                <p>{product.sold}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <div className='text-2xl my-2'>Đơn hàng mới nhất</div>
        {orderTable && (
          <TableProduct<OrderType> dataProduct={orderTable.items} columns={OrderColumns} paginate={orderTable.meta} />
        )}
      </div>
    </div>
  );
};

export default DashboardCom;
