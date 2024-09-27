"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  TableSortLabel,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import Image from "next/image";
import { Search, SearchX, Eye, Delete, Plus } from "lucide-react";
import ProductDetailModal from "./productsdetailmodal";
import { useSession } from "next-auth/react";

const columns = [
  {
    id: "action",
    label: "Action",
    minWidth: 100,
    align: "center",
    sortable: false,
  },
  { id: "product", label: "Product", minWidth: 150, sortable: true },
  {
    id: "image",
    label: "Image",
    minWidth: 100,
    align: "left",
    sortable: false,
  },
  { id: "category", label: "Category", minWidth: 100, sortable: true },
  {
    id: "quantity",
    label: "Quantity",
    minWidth: 100,
    align: "left",
    sortable: true,
  },
  { id: "price", label: "Price", minWidth: 100, align: "left", sortable: true },
];

export default function ProductTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("product");
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [session]);

  const fetchProducts = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/products/${session.user.id}`);

      if (response.status === 404) {
        // If no products are found, set an empty array and don't throw an error
        setRows([]);
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Error fetching products! try checking your connection or try again later."
        );
      }

      const products = await response.json();
      const formattedProducts = products.data.map((product) => ({
        id: product._id,
        product: product.name,
        image: product.image || "https://via.placeholder.com/50",
        category: product.category,
        quantity: product.instock,
        price: product.price,
      }));

      setRows(formattedProducts);
    } catch (err) {
      setError(err.message);
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDeleteConfirm = (product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error deleting product");
      }

      setRows((prevRows) =>
        prevRows.filter((row) => row.id !== productToDelete.id)
      );
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
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

  const getComparator = (order, orderBy) => {
    return order === "desc"
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

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const filteredRows = stableSort(
    rows.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    ),
    getComparator(order, orderBy)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
        <Typography variant="h6" className="ml-4">
          Loading products...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="mt-5 mx-auto max-w-7xl px-4 sm:px-2 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-2xl text-gray-800">All Products</h1>
        <Link
          href="products/add"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-300"
        >
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
              <IconButton
                onClick={() => setIsVisible((prev) => !prev)}
                className="ml-2"
              >
                {isVisible ? (
                  <SearchX className="text-gray-600" />
                ) : (
                  <Search className="text-gray-600" />
                )}
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
                        direction={orderBy === column.id ? order : "asc"}
                        onClick={() => handleRequestSort(column.id)}
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
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography variant="subtitle1">
                      No products found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "image" ? (
                              <Image
                                src={value}
                                alt={row.product}
                                width={70}
                                height={70}
                                className="rounded-md shadow-sm"
                              />
                            ) : column.id === "action" ? (
                              <div className="flex items-center justify-center">
                                <IconButton
                                  onClick={() => handleView(row)}
                                  aria-label="view"
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Eye />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleDeleteConfirm(row)}
                                  aria-label="delete"
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Delete />
                                </IconButton>
                              </div>
                            ) : column.id === "category" ? (
                              <Chip
                                label={value}
                                size="small"
                                className="bg-blue-100 text-blue-800"
                              />
                            ) : column.id === "price" ? (
                              <span className="font-semibold text-green-600">
                                ${value.toFixed(2)}
                              </span>
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
              )}
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

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
