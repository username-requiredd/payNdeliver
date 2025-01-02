"use client";
import { formatCurrency } from "@/hooks/formatcurrency";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

const DashboardComponent = ({ data }) => {
  // Debug the data to verify its structure
  // console.log("Data received in DashboardComponent:", data);

  // Safely map the latest orders
  const latestOrders =
    Array.isArray(data) && data.length > 0
      ? data[0]?.items?.map(({ productName, quantity, subtotalUSD }) => ({
          productName,
          quantity,
          subtotalUSD,
        }))
      : [];

  // Safely map recent transactions
  const transactions =
    Array.isArray(data) && data.length > 0
      ? data.map(({ _id, payment, totalAmountUSD }) => ({
          id: _id,
          description: `Payment via ${payment.type} (${payment.status})`,
          amount: formatCurrency(totalAmountUSD, "en-NG", "NGN"),
        }))
      : [];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Orders Table */}
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>No</StyledTableCell>
                  <StyledTableCell>Business Name</StyledTableCell>
                  <StyledTableCell>Business Description</StyledTableCell>
                  <StyledTableCell align="right">Date Created</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {latestOrders.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{order.productName}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(order.subtotalUSD, "en-NG", "NGN")}
                    </TableCell>
                  </TableRow>
                ))}
                {latestOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No orders available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Transactions List */}
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
                {transactions.length === 0 && (
                  <Typography align="center">
                    No transactions available
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardComponent;
