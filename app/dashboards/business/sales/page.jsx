"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowUpDown } from "lucide-react";
import { formatCurrency } from "@/hooks/formatcurrency";

const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm p-6">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 w-48 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-xl shadow-sm mb-6 p-6">
      <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm p-6">
          <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-80 bg-gray-100 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

const ProductSalesPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.id) return;
      try {
        const response = await fetch(`/api/orders/${session?.user?.id}`);
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session?.user?.id]);

  const aggregateProducts = (orders) => {
    const productMap = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (productMap[item.productName]) {
          productMap[item.productName].sales += item.quantity;
          productMap[item.productName].revenue += item.subtotalUSD;
        } else {
          productMap[item.productName] = {
            name: item.productName,
            sales: item.quantity,
            revenue: item.subtotalUSD,
          };
        }
      });
    });
    return Object.values(productMap);
  };

  const COLORS = ["#4f46e5", "#7c3aed", "#ec4899", "#f43f5e", "#f97316"];
  const sortData = (data) => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (loading) return <SkeletonLoader />;

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 bg-white p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
          <p className="text-gray-500">
            Start selling to see your analytics here.
          </p>
        </div>
      </div>
    );
  }

  const topSellingProducts = aggregateProducts(orders);
  const sortedProducts = sortData(topSellingProducts);

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-4xl font-bold text-indigo-800 mb-2">
              Product Sales Analysis
            </h1>
            <p className=" mb-8">Track your product performance and revenue</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Total Revenue
            </h2>
            <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
              {formatCurrency(
                parseInt(
                  topSellingProducts.reduce(
                    (sum, product) => sum + product.revenue,
                    0
                  )
                ),
                "en-NG",
                "NGN"
              )}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Total Units Sold
            </h2>
            <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
              {topSellingProducts
                .reduce((sum, product) => sum + product.sales, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Selling Products
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort("name")}
                  >
                    <div className="flex items-center">
                      Product Name
                      <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort("sales")}
                  >
                    <div className="flex items-center justify-end">
                      Units Sold
                      <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort("revenue")}
                  >
                    <div className="flex items-center justify-end">
                      Revenue
                      <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedProducts.map((product, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">
                      {product.sales.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                      {product.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Revenue Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedProducts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Sales Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sortedProducts}
                    dataKey="sales"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {sortedProducts.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSalesPage;
