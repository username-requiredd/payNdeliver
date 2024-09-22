"use client"
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Card, CardContent, Typography, List, ListItem, ListItemText, 
  Grid, Box
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const DashboardComponent = () => {
  // Sample data - replace with your actual data
  const latestOrders = [
    { id: 1, customer: 'John Doe', product: 'Laptop', total: '$999' },
    { id: 2, customer: 'Jane Smith', product: 'Smartphone', total: '$699' },
    { id: 3, customer: 'Bob Johnson', product: 'Headphones', total: '$199' },
  ];

  const transactions = [
    { id: 1, description: 'Payment received', amount: '+$999' },
    { id: 2, description: 'Refund processed', amount: '-$50' },
    { id: 3, description: 'Payment received', amount: '+$699' },
  ];

  const bestSellingProducts = [
    { name: 'Laptop', sales: 120 },
    { name: 'Smartphone', sales: 95 },
    { name: 'Headphones', sales: 80 },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Order ID</StyledTableCell>
                  <StyledTableCell>Customer</StyledTableCell>
                  <StyledTableCell>Product</StyledTableCell>
                  <StyledTableCell align="right">Total</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {latestOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell align="right">{order.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <List>
                {transactions.map((transaction) => (
                  <StyledListItem key={transaction.id}>
                    <ListItemText 
                      primary={transaction.description}
                      secondary={transaction.amount}
                    />
                  </StyledListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Best Selling Products
              </Typography>
              <List>
                {bestSellingProducts.map((product, index) => (
                  <StyledListItem key={index}>
                    <ListItemText 
                      primary={product.name}
                      secondary={`${product.sales} units sold`}
                    />
                  </StyledListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default DashboardComponent;