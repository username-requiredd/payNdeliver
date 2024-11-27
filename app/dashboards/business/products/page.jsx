"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image'; 
import { Search, SearchX, Eye, Trash2, Plus } from 'lucide-react';
import ProductDetailModal from './productsdetailmodal';
import { Typography, Chip, TextField, InputAdornment, TableSortLabel } from '@mui/material';
import { useSession } from 'next-auth/react';
const columns = [
  { id: 'action', label: 'Action', minWidth: 100, align: 'center', sortable: false },
  { id: 'product', label: 'Product', minWidth: 150, sortable: true },
  { id: 'image', label: 'Image', minWidth: 100, align: 'left', sortable: false },
  { id: 'category', label: 'Category', minWidth: 100, sortable: true },
  { id: 'quantity', label: 'Quantity', minWidth: 100, align: 'left', sortable: true },
  { id: 'price', label: 'Price', minWidth: 100, align: 'left', sortable: true },
];




const initialRows = [
  { id: 1, product: 'Laptop', image: 'https://via.placeholder.com/50', category: 'Electronics', quantity: 3, price: 1500 },
  { id: 2, product: 'Headphones', image: 'https://via.placeholder.com/50', category: 'Accessories', quantity: 10, price: 300 },
  { id: 3, product: 'Coffee Mug', image: 'https://via.placeholder.com/50', category: 'Kitchen', quantity: 5, price: 15 },
  { id: 13, product: 'Coffee Mug', image: 'https://via.placeholder.com/50', category: 'Kitchen', quantity: 5, price: 15 },
  { id: 32, product: 'Coffee Mug', image: 'https://via.placeholder.com/50', category: 'Kitchen', quantity: 5, price: 15 },
  { id: 34, product: 'Coffee Mug', image: 'https://via.placeholder.com/50', category: 'Kitchen', quantity: 5, price: 15 },
  { id: 33, product: 'Coffee Mug', image: 'https://via.placeholder.com/50', category: 'Kitchen', quantity: 5, price: 15 },
];

export default function ProductTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [rows, setRows] = useState(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('product');


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleDelete = (id) => {
    const updatedRows = rows.filter((item) => item.id !== id);
    setRows(updatedRows);
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
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

  const filteredRows = stableSort(
    rows.filter(row =>
      Object.values(row).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    ),
    getComparator(order, orderBy)
  );

  return (
    <div className="mt-5 mx-auto max-w-7xl px-4 sm:px-2 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-2xl text-gray-800">
          All Products
        </h1>
        <Link href="products/add" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-300">
          <Plus className="mr-2" size={20} />
          Add a Product
        </Link>
      </div>
      <Paper className="mb-5 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <Typography variant="h6" className="text-gray-700">
              Product Inventory
            </Typography>
            <div className="flex items-center">
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                className={`transition-all duration-300 ease-in-out ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
              />
              <IconButton onClick={() => setIsVisible((prev) => !prev)} className="ml-2">
                {isVisible ? <SearchX className="text-gray-600" /> : <Search className="text-gray-600" />}
              </IconButton>
            </div>
          </div>
        </div>
        <TableContainer>
          <Table stickyHeader aria-label="customized table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    className="font-bold text-gray-700 bg-gray-100"
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} className="transition-colors hover:bg-gray-50">
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'image' ? (
                            <Image src={value} alt={row.product} width={70} height={70} className="rounded-md shadow-sm" />
                          ) : column.id === 'action' ? (
                            <div className='flex items-center justify-center'>
                              <IconButton onClick={() => handleView(row)} aria-label="view" className="text-blue-600 hover:text-blue-800">
                                <Eye />
                              </IconButton>
                              <IconButton onClick={() => handleDelete(row.id)} aria-label="delete" className="text-red-600 hover:text-red-800">
                                <Trash2 />
                              </IconButton>
                            </div>
                          ) : column.id === 'category' ? (
                            <Chip label={value} size="small" className="bg-blue-100 text-blue-800" />
                          ) : column.id === 'price' ? (
                            <span className="font-semibold text-green-600">${value.toFixed(2)}</span>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="border-t"
        />
      </Paper>

      <ProductDetailModal
        open={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </div>
  );
}