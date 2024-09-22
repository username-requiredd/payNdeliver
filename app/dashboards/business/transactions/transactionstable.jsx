"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TableSortLabel,
} from '@mui/material';

import { useState } from 'react';
function createData(paymentNumber, dateTime, amount, status) {
  return { paymentNumber, dateTime, amount, status };
}

const rows = [
  createData('0001', '2024-08-25 12:00 PM', 100, 'Completed'),
  createData('0002', '2024-08-24 03:15 PM', 150, 'Pending'),
  createData('0003', '2024-08-23 10:30 AM', 200, 'Failed'),
  createData('0004', '2024-08-22 05:45 PM', 250, 'Completed'),
  createData('0005', '2024-08-21 08:00 AM', 300, 'Completed'),
];

export default function TransactionsTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('paymentNumber');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  return (
    <TableContainer component={Paper} style={{ marginTop: 20 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Transactions
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'paymentNumber'}
                direction={orderBy === 'paymentNumber' ? order : 'asc'}
                onClick={(event) => handleRequestSort(event, 'paymentNumber')}
              >
                Payment Number
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'dateTime'}
                direction={orderBy === 'dateTime' ? order : 'asc'}
                onClick={(event) => handleRequestSort(event, 'dateTime')}
              >
                Date and Time
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === 'amount'}
                direction={orderBy === 'amount' ? order : 'asc'}
                onClick={(event) => handleRequestSort(event, 'amount')}
              >
                Amount
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'status'}
                direction={orderBy === 'status' ? order : 'asc'}
                onClick={(event) => handleRequestSort(event, 'status')}
              >
                Status
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stableSort(rows, getComparator(order, orderBy)).map((row) => (
            <TableRow
              key={row.paymentNumber}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.paymentNumber}
              </TableCell>
              <TableCell>{row.dateTime}</TableCell>
              <TableCell align="right">{`$${row.amount.toFixed(2)}`}</TableCell>
              <TableCell>
                <span
                  style={{
                    color:
                      row.status === 'Completed'
                        ? 'green'
                        : row.status === 'Pending'
                        ? 'orange'
                        : 'red',
                    fontWeight: 'bold',
                  }}
                >
                  {row.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
