"use client";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
  Box,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Banknote, ShoppingBag, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import DashboardComponent from "./dashboard";
import { useSession } from "next-auth/react";
import { formatCurrency } from "@/hooks/formatcurrency";

const DashboardChart = () => {
  const theme = useTheme();
  const { data: session } = useSession();

  // Fetch orders data
  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["business"],
    queryFn: () =>
      fetch(`/api/orders/${session?.user?.id}`).then((res) => res.json()),
  });

  // Handling potential error or loading state
  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error fetching data.</Typography>;

  // Calculate totals
  const totalOrders = ordersData.data?.length || 0;
  const totalSales =
    ordersData.data?.reduce(
      (sum, order) => sum + (order.totalAmountUSD || 0),
      0
    ) || 0;

  // Calculate unique customers
  const uniqueCustomerIds = new Set(
    ordersData.data?.map((order) => order.customerId)
  );
  const totalCustomers = uniqueCustomerIds.size;

  // Prepare chart data
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = months.map((month, index) => {
    const monthlyData = ordersData.data?.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === index;
    });

    return {
      name: month,
      orders: monthlyData?.length || 0,
      sales:
        monthlyData?.reduce(
          (sum, order) => sum + (order.totalAmountUSD || 0),
          0
        ) || 0,
      customers: new Set(monthlyData?.map((order) => order.customerId)).size,
    };
  });

  // StatCard component for displaying statistics
  const StatCard = ({ title, value, color, icon: Icon }) => (
    <Card sx={{ height: "100%", backgroundColor: color, color: "white" }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Icon sx={{ fontSize: 40, opacity: 0.7 }} />
        </Box>
        <Typography variant="h4" component="div" sx={{ mt: 2 }}>
          {value.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Grid container className="mt-5 p-2" spacing={3}>
      {/* Display Total Orders */}
      <Grid item xs={12} md={4}>
        <StatCard
          title="Total Orders"
          value={totalOrders}
          color={theme.palette.primary.main}
          icon={ShoppingBag}
        />
      </Grid>

      {/* Display Total Sales */}
      <Grid item xs={12} md={4}>
        <StatCard
          title="Total Sales"
          value={formatCurrency(totalSales, "en-NG", "NGN")}
          color={theme.palette.secondary.main}
          icon={Banknote}
        />
      </Grid>

      {/* Display Total Customers */}
      <Grid item xs={12} md={4}>
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          color={theme.palette.success.main}
          icon={Users}
        />
      </Grid>

      {/* Display Monthly Trends Chart */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
              Monthly Trends
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke={theme.palette.primary.main}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke={theme.palette.secondary.main}
                />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke={theme.palette.success.main}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <DashboardComponent data={ordersData?.data} />
    </Grid>
  );
};

export default DashboardChart;
