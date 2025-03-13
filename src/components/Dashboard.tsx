import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import { format } from 'date-fns';
import { TrendingUp, Package, Users, DollarSign } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Mock data - Replace with real data from your backend
const last7Days = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  return format(date, 'MMM dd');
}).reverse();

const salesData = {
  labels: last7Days,
  datasets: [{
    label: 'Daily Sales Average',
    data: [2500, 3200, 2800, 4100, 3600, 3900, 4500],
    backgroundColor: 'rgba(54, 162, 235, 0.5)',
    borderColor: 'rgb(54, 162, 235)',
    borderWidth: 1
  }]
};

const deliveriesData = {
  labels: last7Days,
  datasets: [{
    label: 'Daily Deliveries',
    data: [45, 52, 38, 60, 55, 58, 65],
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1,
    fill: false
  }]
};

const customerHeatmapData = {
  datasets: [{
    label: 'Customer Growth',
    data: Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 20
    })),
    backgroundColor: 'rgba(255, 99, 132, 0.5)'
  }]
};

const salesByRepData = {
  labels: ['John', 'Maria', 'Carlos', 'Sarah', 'Mike'],
  datasets: [{
    data: [30, 25, 20, 15, 10],
    backgroundColor: [
      'rgba(255, 99, 132, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(153, 102, 255, 0.5)'
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)'
    ],
    borderWidth: 1
  }]
};

const StatCard = ({ icon: Icon, title, value, trend }: { icon: any, title: string, value: string, trend: string }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <p className="text-green-500 text-sm mt-2">{trend}</p>
      </div>
      <div className="bg-blue-50 p-3 rounded-full">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
    </div>
  </div>
);

export function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={TrendingUp}
          title="Weekly Revenue"
          value="$32,450"
          trend="+12.5% from last week"
        />
        <StatCard
          icon={Package}
          title="Total Deliveries"
          value="318"
          trend="+8.2% from last week"
        />
        <StatCard
          icon={Users}
          title="New Customers"
          value="124"
          trend="+15.3% from last week"
        />
        <StatCard
          icon={DollarSign}
          title="Weekly Profit"
          value="$12,628"
          trend="+10.4% from last week"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Average */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Daily Sales Average</h2>
          <Bar
            data={salesData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
            }}
          />
        </div>

        {/* Daily Deliveries */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Daily Deliveries</h2>
          <Line
            data={deliveriesData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
            }}
          />
        </div>

        {/* Customer Growth Heatmap */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Customer Growth Distribution</h2>
          <Scatter
            data={customerHeatmapData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Region',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Growth Rate',
                  },
                },
              },
            }}
          />
        </div>

        {/* Sales by Representative */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Sales by Representative</h2>
          <Pie
            data={salesByRepData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}