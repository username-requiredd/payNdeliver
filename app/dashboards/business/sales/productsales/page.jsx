"use client"
import { 
  Grid, Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';

const ProductSalesPage = () => {
  // Sample data - replace with your actual data
  const topSellingProducts = [
    { name: 'Laptop Pro', sales: 1200, revenue: 1440000 },
    { name: 'Smartphone X', sales: 800, revenue: 560000 },
    { name: 'Wireless Earbuds', sales: 2000, revenue: 300000 },
    { name: 'Smart Watch', sales: 500, revenue: 150000 },
    { name: 'Tablet Y', sales: 300, revenue: 150000 },
  ];

  const salesTrendData = [
    { month: 'Jan', laptops: 200, smartphones: 150, tablets: 100 },
    { month: 'Feb', laptops: 250, smartphones: 180, tablets: 120 },
    { month: 'Mar', laptops: 300, smartphones: 200, tablets: 150 },
    { month: 'Apr', laptops: 280, smartphones: 220, tablets: 130 },
    { month: 'May', laptops: 350, smartphones: 250, tablets: 170 },
    { month: 'Jun', laptops: 400, smartphones: 300, tablets: 200 },
  ];

  const categoryDistribution = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Books', value: 200 },
    { name: 'Home & Garden', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box className="mt-5" sx={{ flexGrow: 1, p: 3 }}>
      <h1 className='text-xl font-semibold mb-5'>
        Product Sales Analysis
      </h1>
      <Grid container spacing={3}>
        {/* Top Selling Products Table */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Selling Products
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell align="right">Units Sold</TableCell>
                    <TableCell align="right">Revenue ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topSellingProducts.map((product) => (
                    <TableRow key={product.name}>
                      <TableCell component="th" scope="row">
                        {product.name}
                      </TableCell>
                      <TableCell align="right">{product.sales}</TableCell>
                      <TableCell align="right">{product.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Product Sales Trend */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Product Sales Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="laptops" stroke="#8884d8" />
                <Line type="monotone" dataKey="smartphones" stroke="#82ca9d" />
                <Line type="monotone" dataKey="tablets" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Sales by Category */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sales by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Top Products by Revenue */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Products by Revenue
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topSellingProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductSalesPage;