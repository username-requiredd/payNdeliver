"use client"
import { 
  Grid, Paper, Typography, Box 
} from '@mui/material';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
const SalesAnalysisPage = () => {
  // Sample data - replace with your actual data
  const monthlySalesData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
    { month: 'Jun', sales: 5500 },
  ];

  const productSalesData = [
    { product: 'Laptop', sales: 4000 },
    { product: 'Smartphone', sales: 3000 },
    { product: 'Tablet', sales: 2000 },
    { product: 'Headphones', sales: 1500 },
  ];

  const salesChannelData = [
    { name: 'Website', value: 400 },
    { name: 'Mobile App', value: 300 },
    { name: 'Marketplace', value: 200 },
    { name: 'Social Media', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="mt-5">
    <Box className sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Sales Analysis
      </Typography>
      <Link className='bg-green-600 p-4 hover:bg-green-700 flex items-center text-white w-fit mb-5 font-semibold' href={"sales/productsales"}>
      View Products Sales <ArrowRight className='mx-1' /> 
      </Link>
      <Grid container spacing={3}>
        {/* Monthly Sales Trend */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Sales Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Sales by Product */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sales by Product
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Sales Channel Distribution */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sales Channel Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesChannelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {salesChannelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>

    </div>
  );
};

export default SalesAnalysisPage;