import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ShoppingCart,
  Users,
  DollarSign,
  Activity,
  CreditCard,
  Package,
} from "lucide-react";

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 2000 },
  { name: "Apr", sales: 2780 },
  { name: "May", sales: 1890 },
  { name: "Jun", sales: 2390 },
];

const revenueData = [
  { name: "Jan", revenue: 2400 },
  { name: "Feb", revenue: 1398 },
  { name: "Mar", revenue: 9800 },
  { name: "Apr", revenue: 3908 },
  { name: "May", revenue: 4800 },
  { name: "Jun", revenue: 3800 },
];

const metrics = [
  {
    title: "Total Sales",
    value: "$12,345",
    icon: ShoppingCart,
    description: "+12% from last month",
    trend: "up",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Revenue",
    value: "$45,678",
    icon: DollarSign,
    description: "+8% from last month",
    trend: "up",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Customers",
    value: "1,234",
    icon: Users,
    description: "+5% from last month",
    trend: "up",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "Orders",
    value: "567",
    icon: Package,
    description: "+3% from last month",
    trend: "up",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
];

const StorePerformance = () => {
  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl">
        {/* Page Header */}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${metric.bgColor} p-3 rounded-lg`}>
                    <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {metric.description}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {metric.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
              Monthly Sales
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Monthly Revenue
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {["Average Order Value", "Conversion Rate", "Customer Retention"].map(
            (title, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                  <span className="text-sm text-green-500 bg-green-50 px-3 py-1 rounded-full">
                    +2% from last month
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {index === 0 ? "$45.67" : index === 1 ? "3.2%" : "78%"}
                </p>
                <div className="flex items-center">
                  <Activity className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-500">30 day trend</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default StorePerformance;
