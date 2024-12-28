"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  UserPlus,
  Eye,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Avatar,
} from "@mui/material";

const ProductsTable = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const { data: session } = useSession();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!session?.user?.id) return;
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${session.user.id}`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [session?.user?.id]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <div className="w-4 h-4 inline-block" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="w-4 h-4 inline-block" />
    ) : (
      <ChevronDown className="w-4 h-4 inline-block" />
    );
  };

  const sortedAndFilteredProducts = useMemo(() => {
    let filteredProducts = products;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredProducts = products.filter((product) => {
        const name = String(product.name || "");
        const category = String(product.category || "");
        const price = String(product.price || "");

        return (
          name.toLowerCase().includes(searchLower) ||
          category.toLowerCase().includes(searchLower) ||
          price.includes(searchLower)
        );
      });
    }

    if (sortConfig.key) {
      filteredProducts.sort((a, b) => {
        const aValue = String(a[sortConfig.key] || "").toLowerCase();
        const bValue = String(b[sortConfig.key] || "").toLowerCase();

        if (sortConfig.key === "price") {
          // Handle price sorting numerically
          const aPrice = parseFloat(aValue.replace(/[^0-9.-]+/g, ""));
          const bPrice = parseFloat(bValue.replace(/[^0-9.-]+/g, ""));
          if (sortConfig.direction === "ascending") {
            return aPrice - bPrice;
          }
          return bPrice - aPrice;
        }

        if (sortConfig.direction === "ascending") {
          return aValue.localeCompare(bValue);
        }
        return bValue.localeCompare(aValue);
      });
    }

    return filteredProducts;
  }, [products, searchTerm, sortConfig]);

  const handleDeleteProduct = async () => {
    if (!productToDelete?._id) return;
    const prevProducts = [...products];
    try {
      setProducts(products.filter((p) => p._id !== productToDelete._id));
      setDeleteDialogOpen(false);
      const response = await fetch(`/api/products/${productToDelete._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productToDelete._id }),
      });
      if (!response.ok) throw new Error("Failed to delete product");
    } catch (err) {
      setError("Failed to delete product. Please try again.");
      setProducts(prevProducts);
    } finally {
      setProductToDelete(null);
    }
  };

  return (
    <div className="min-h-screen p-2 pt-5 ">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">
            Manage Products
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative w-full sm:w-1/3">
              <input
                type="text"
                placeholder="Search by name, category or price..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>
            <Link
              href="products/add"
              className="flex items-center justify-center px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
            >
              <UserPlus size={20} className="mr-2" />
              Add Product
            </Link>
          </div>

          <TableContainer
            component={Paper}
            className="max-h-[calc(100vh-300px)] overflow-auto rounded-lg shadow-md"
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow className="bg-indigo-100">
                  <TableCell className="font-semibold text-indigo-800">
                    Image
                  </TableCell>
                  <TableCell
                    className="font-semibold text-indigo-800 cursor-pointer"
                    onClick={() => requestSort("name")}
                  >
                    Name {getSortIcon("name")}
                  </TableCell>
                  <TableCell
                    className="font-semibold text-indigo-800 cursor-pointer"
                    onClick={() => requestSort("category")}
                  >
                    Category {getSortIcon("category")}
                  </TableCell>
                  <TableCell
                    className="font-semibold text-indigo-800 cursor-pointer"
                    onClick={() => requestSort("instock")}
                  >
                    In Stock {getSortIcon("instock")}
                  </TableCell>
                  <TableCell
                    className="font-semibold text-indigo-800 cursor-pointer"
                    onClick={() => requestSort("price")}
                  >
                    Price {getSortIcon("price")}
                  </TableCell>
                  <TableCell
                    align="right"
                    className="font-semibold text-indigo-800"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <TableRow key={i}>
                        {Array(6)
                          .fill(null)
                          .map((_, j) => (
                            <TableCell key={j}>
                              <div className="h-6 bg-gray-200 rounded animate-pulse" />
                            </TableCell>
                          ))}
                      </TableRow>
                    ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sortedAndFilteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
                        <p className="font-bold">No results found</p>
                        <p>No products match your search criteria.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedAndFilteredProducts.map((product, index) => (
                    <TableRow
                      key={product._id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <TableCell>
                        <Avatar
                          src={product.image || "/images/default.jpg"}
                          alt={product.name}
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.instock}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell className="flex justify-end space-x-2">
                        <Link href={`products/${product._id}`}>
                          <IconButton className="hover:bg-indigo-100">
                            <Eye
                              className="text-blue-600 hover:text-blue-800"
                              size={20}
                            />
                          </IconButton>
                        </Link>
                        <IconButton
                          onClick={() => {
                            setProductToDelete(product);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={20} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ style: { borderRadius: "12px" } }}
      >
        <DialogTitle className="bg-red-100 text-red-800">
          Confirm Product Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="mt-4">
            Are you sure you want to delete {productToDelete?.name}? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded-full"
            onClick={() => setDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-full"
            onClick={handleDeleteProduct}
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductsTable;
