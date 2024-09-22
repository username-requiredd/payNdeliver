"use client"
import  { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
} from '@mui/material';

function createData(id, date, orderNumber, status, total) {
  return { id, date, orderNumber, status, total };
}

const rows = [
  createData(1, '2024-08-23', 'ORD123', 'Paid', 150),
  createData(2, '2024-08-20', 'ORD124', 'Pending', 250),
  createData(3, '2024-08-18', 'ORD125', 'Cancelled', 120),
  createData(4, '2024-08-16', 'ORD126', 'Delivered', 175),
  createData(5, '2024-08-15', 'ORD127', 'Paid', 300),
];

function SortableTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('date');

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedRows = rows.sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return a[orderBy] > b[orderBy] ? -1 : 1;
    }
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sortDirection={orderBy === 'id' ? order : false}>
              <TableSortLabel
                active={orderBy === 'id'}
                direction={orderBy === 'id' ? order : 'asc'}
                onClick={() => handleSortRequest('id')}
              >
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === 'date' ? order : false}>
              <TableSortLabel
                active={orderBy === 'date'}
                direction={orderBy === 'date' ? order : 'asc'}
                onClick={() => handleSortRequest('date')}
              >
                Date
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === 'orderNumber' ? order : false}>
              <TableSortLabel
                active={orderBy === 'orderNumber'}
                direction={orderBy === 'orderNumber' ? order : 'asc'}
                onClick={() => handleSortRequest('orderNumber')}
              >
                Order Number
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === 'status' ? order : false}>
              <TableSortLabel
                active={orderBy === 'status'}
                direction={orderBy === 'status' ? order : 'asc'}
                onClick={() => handleSortRequest('status')}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === 'total' ? order : false}>
              <TableSortLabel
                active={orderBy === 'total'}
                direction={orderBy === 'total' ? order : 'asc'}
                onClick={() => handleSortRequest('total')}
              >
                Total
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.orderNumber}</TableCell>
              <TableCell className={`font-semibold ${row.status === "Paid" ? "bg-green-200 text-green-700" : row.status === "Pending" ? "bg-yellow-200 text-yellow-700" : row.status ==="Cancelled" ? "bg-red-200 text-red-700":"" }`}>{row.status}</TableCell>
              <TableCell>${row.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SortableTable;
