"use client";
import React, { useState } from "react";
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
  TablePagination,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
// import { Search, GetApp, Visibility, Print } from "@mui/icons-material";
import { Search,Eye,Printer } from "lucide-react";

const createData = (
  id,
  studentName,
  paymentNumber,
  dateTime,
  amount,
  paymentType,
  status,
  grade
) => {
  return {
    id,
    studentName,
    paymentNumber,
    dateTime,
    amount,
    paymentType,
    status,
    grade,
  };
};

const rows = [
  createData(
    1,
    "John Doe",
    "0001",
    "2024-08-25 12:00 PM",
    100,
    "Tuition",
    "Completed",
    "10A"
  ),
  createData(
    2,
    "Jane Smith",
    "0002",
    "2024-08-24 03:15 PM",
    150,
    "Library Fee",
    "Pending",
    "11B"
  ),
  createData(
    3,
    "Bob Johnson",
    "0003",
    "2024-08-23 10:30 AM",
    200,
    "Sports Fee",
    "Failed",
    "9C"
  ),
  createData(
    4,
    "Alice Brown",
    "0004",
    "2024-08-22 05:45 PM",
    250,
    "Tuition",
    "Completed",
    "12A"
  ),
  createData(
    5,
    "Charlie Davis",
    "0005",
    "2024-08-21 08:00 AM",
    300,
    "Exam Fee",
    "Completed",
    "10B"
  ),
];

const TransactionsTable = () => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("paymentNumber");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleViewOpen = (transaction) => {
    setSelectedTransaction(transaction);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
  };

  const handlePrintOpen = (transaction) => {
    setSelectedTransaction(transaction);
    setPrintDialogOpen(true);
  };

  const handlePrintClose = () => {
    setPrintDialogOpen(false);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("print-content");
    const winPrint = window.open(
      "",
      "",
      "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
    );
    winPrint.document.write(printContent.innerHTML);
    winPrint.document.close();
    winPrint.focus();
    winPrint.print();
    winPrint.close();
    handlePrintClose();
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        value && value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const sortedRows = filteredRows.sort((a, b) => {
    if (b[orderBy] < a[orderBy]) return order === "asc" ? 1 : -1;
    if (b[orderBy] > a[orderBy]) return order === "asc" ? -1 : 1;
    return 0;
  });

  const totalReceived = rows.reduce(
    (sum, row) => (row.status === "Completed" ? sum + row.amount : sum),
    0
  );
  const totalPending = rows.reduce(
    (sum, row) => (row.status === "Pending" ? sum + row.amount : sum),
    0
  );
  const totalFailed = rows.reduce(
    (sum, row) => (row.status === "Failed" ? sum + row.amount : sum),
    0
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Transactions
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Received</Typography>
              <Typography variant="h4" color="success.main">
                ${totalReceived.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Pending</Typography>
              <Typography variant="h4" color="warning.main">
                ${totalPending.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Failed</Typography>
              <Typography variant="h4" color="error.main">
                ${totalFailed.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          placeholder="Search transactions"
          value={search}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />,
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "studentName"}
                  direction={orderBy === "studentName" ? order : "asc"}
                  onClick={() => handleRequestSort("studentName")}
                >
                  Student Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "paymentNumber"}
                  direction={orderBy === "paymentNumber" ? order : "asc"}
                  onClick={() => handleRequestSort("paymentNumber")}
                >
                  Payment Number
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "dateTime"}
                  direction={orderBy === "dateTime" ? order : "asc"}
                  onClick={() => handleRequestSort("dateTime")}
                >
                  Date and Time
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "amount"}
                  direction={orderBy === "amount" ? order : "asc"}
                  onClick={() => handleRequestSort("amount")}
                >
                  Amount
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "paymentType"}
                  direction={orderBy === "paymentType" ? order : "asc"}
                  onClick={() => handleRequestSort("paymentType")}
                >
                  Payment Type
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleRequestSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "grade"}
                  direction={orderBy === "grade" ? order : "asc"}
                  onClick={() => handleRequestSort("grade")}
                >
                  Product
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.studentName}</TableCell>
                  <TableCell>{row.paymentNumber}</TableCell>
                  <TableCell>{row.dateTime}</TableCell>
                  <TableCell>${row.amount.toFixed(2)}</TableCell>
                  <TableCell>{row.paymentType}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "inline-block",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor:
                          row.status === "Completed"
                            ? "success.light"
                            : row.status === "Pending"
                            ? "warning.light"
                            : "error.light",
                        color:
                          row.status === "Completed"
                            ? "success.dark"
                            : row.status === "Pending"
                            ? "warning.dark"
                            : "error.dark",
                      }}
                    >
                      {row.status}
                    </Typography>
                  </TableCell>
                  <TableCell>{row.grade}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<Eye />}
                      onClick={() => handleViewOpen(row)}
                    >
                      View
                    </Button>
                    {/* <Button
                      size="small"
                      startIcon={<Print />}
                      onClick={() => handlePrintOpen(row)}
                    >
                      Print
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleViewClose}>
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <List>
              <ListItem>
                <ListItemText
                  primary="Student Name"
                  secondary={selectedTransaction.studentName}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Payment Number"
                  secondary={selectedTransaction.paymentNumber}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Date and Time"
                  secondary={selectedTransaction.dateTime}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Amount"
                  secondary={`$${selectedTransaction.amount.toFixed(2)}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Payment Type"
                  secondary={selectedTransaction.paymentType}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Status"
                  secondary={selectedTransaction.status}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Grade"
                  secondary={selectedTransaction.grade}
                />
              </ListItem>
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Print Dialog */}
      <Dialog open={printDialogOpen} onClose={handlePrintClose}>
        <DialogTitle>Print Transaction</DialogTitle>
        <DialogContent>
          <div id="print-content">
            {selectedTransaction && (
              <>
                <Typography variant="h6" gutterBottom>
                  Transaction Receipt
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Student: {selectedTransaction.studentName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Payment Number: {selectedTransaction.paymentNumber}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Date: {selectedTransaction.dateTime}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Amount: ${selectedTransaction.amount.toFixed(2)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Type: {selectedTransaction.paymentType}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Status: {selectedTransaction.status}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Grade: {selectedTransaction.grade}
                </Typography>
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrintClose}>Cancel</Button>
          <Button onClick={handlePrint} variant="contained" color="primary">
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionsTable;
