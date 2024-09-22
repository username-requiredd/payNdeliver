"use client"
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  useTheme,
  Box
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Banknote, ShoppingBag, Users } from 'lucide-react';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import PeopleIcon from '@mui/icons-material/People';
import DashboardComponent from './dashboard';

// Sample data
const data = [
  { name: 'Jan', orders: 4000, sales: 2400, customers: 2400 },
  { name: 'Feb', orders: 3000, sales: 1398, customers: 2210 },
  { name: 'Mar', orders: 2000, sales: 9800, customers: 2290 },
  { name: 'Apr', orders: 2780, sales: 3908, customers: 2000 },
  { name: 'May', orders: 1890, sales: 4800, customers: 2181 },
  { name: 'Jun', orders: 2390, sales: 3800, customers: 2500 },
  { name: 'Jul', orders: 3490, sales: 4300, customers: 2100 },
];

const DashboardChart = () => {
  const theme = useTheme();

  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  const totalCustomers = data.reduce((sum, item) => sum + item.customers, 0);

  const StatCard = ({ title, value, color, icon: Icon }) => (
    <Card sx={{ height: '100%', backgroundColor: color, color: 'white' }}>
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
    <Grid container className='mt-5 p-2' spacing={3}>
      <Grid item xs={12} md={4}>
        <StatCard 
          title="Total Orders" 
          value={totalOrders} 
          color={theme.palette.primary.main}
          icon={ShoppingBag}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <StatCard 
          title="Total Sales" 
          value={totalSales} 
          color={theme.palette.secondary.main}
          icon={Banknote}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <StatCard 
          title="Total Customers" 
          value={totalCustomers} 
          color={theme.palette.success.main}
          icon={Users}
        />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
              Monthly Trends
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
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
      <DashboardComponent/>
    </Grid>
  );
};

export default DashboardChart;