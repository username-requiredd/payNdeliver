"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
// import AddproductForm from "./addproduct";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, UserPlus, Eye, Trash2 } from "lucide-react";
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

const PRoductsTable = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState({
    role: "",
    subject: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/products/${session.user.id}`);

        if (!response.ok) {
          throw new Error(
            "Failed to fetch products. Please check your connection and try again."
          );
        }

        const data = await response.json();
        setProducts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [session?.user?.id]);

  const filteredProduct = useMemo(() => {
    if (!products.length) return [];

    return products.filter((product) => {
      const matchesSearch = product.product
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesRole =
        !filterCriteria.role || product.role === filterCriteria.role;
      const matchesSubject =
        !filterCriteria.subject || product.subject === filterCriteria.subject;

      return matchesSearch && matchesRole && matchesSubject;
    });
  }, [products, searchTerm, filterCriteria]);

  const handleDeleteConfirmation = useCallback((product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    const prevProducts = [...products];

    try {
      setProducts(
        products.filter((product) => product._id !== productToDelete._id)
      );
      setDeleteDialogOpen(false);

      const response = await fetch(`/api/products/${productToDelete._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productToDelete._id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      const data = await response.json();
      console.log("Product deleted:", data.message);
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete product. Please try again.");
      setProducts(prevProducts); // Rollback on error
    }
  };

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilterCriteria((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className=" min-h-screen p-6 sm:p-8 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">
            Manage Products
          </h1>
          {/* <p className="text-gray-600">Efficiently manage your product members</p> */}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative w-full sm:w-1/3">
              <input
                type="text"
                placeholder="Search product..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <button
                className="flex items-center justify-center px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200 shadow-md"
                onClick={() => setShowAddForm(true)}
              >
                <UserPlus size={20} className="mr-2" />
                Add product
              </button>
              <select
                name="role"
                value={filterCriteria.role}
                onChange={handleFilterChange}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
              <select
                name="subject"
                value={filterCriteria.subject}
                onChange={handleFilterChange}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              >
                <option value="">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Administration">Administration</option>
                <option value="Counseling">Counseling</option>
              </select>
            </div>
          </div>

          {/* product Table */}
          <TableContainer
            component={Paper}
            className="max-h-[calc(100vh-300px)] overflow-auto rounded-lg shadow-md"
          >
            <Table stickyHeader aria-label="product table">
              <TableHead>
                <TableRow className="bg-indigo-100">
                  <TableCell className="font-semibold text-indigo-800">
                    Image
                  </TableCell>
                  <TableCell className="font-semibold text-indigo-800">
                    Full Name
                  </TableCell>
                  <TableCell className="font-semibold text-indigo-800">
                    Role
                  </TableCell>
                  <TableCell className="font-semibold text-indigo-800">
                    Subject
                  </TableCell>
                  <TableCell className="font-semibold text-indigo-800">
                    Experience (Years)
                  </TableCell>
                  <TableCell className="font-semibold text-indigo-800">
                    Qualification
                  </TableCell>
                  <TableCell className="font-semibold text-indigo-800">
                    Email
                  </TableCell>
                  <TableCell
                    align="right" // Ensure this is set to "right"
                    className="font-semibold text-indigo-800"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <>
                    {[...Array(5)].map((_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        {[...Array(8)].map((_, cellIndex) => (
                          <TableCell key={`skeleton-cell-${cellIndex}`}>
                            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <div
                        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md"
                        role="alert"
                      >
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filterProduct?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <div
                        className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md"
                        role="alert"
                      >
                        <p className="font-bold">No results found</p>
                        <p>
                          There are no product members matching your current
                          filters.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filterProduct?.map((product, index) => (
                    <TableRow
                      key={product._id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <TableCell>
                        <Avatar
                          src={product.image || "/images/profile/default.jpg"}
                          alt={`${product.firstName} ${product.lastName}`}
                        />
                      </TableCell>
                      <TableCell>{`${product.firstName} ${product.lastName}`}</TableCell>
                      <TableCell>{product.role}</TableCell>
                      <TableCell>{product.subject.join(", ")}</TableCell>
                      <TableCell>{product.experience}</TableCell>
                      <TableCell>{product.qualification}</TableCell>
                      <TableCell>{product.email}</TableCell>
                      <TableCell className=" flex flex-row items-center justify-center">
                        <Link
                          href={`/dashboards/admin/manageproducts/${product._id}`}
                          className="text-indigo-600 hover:text-indigo-800 mr-2"
                        >
                          <IconButton
                            aria-label="view"
                            className="hover:bg-indigo-100"
                          >
                            <Eye
                              className="text-blue-600 hover:text-blue-800"
                              size={20}
                            />
                          </IconButton>
                        </Link>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDeleteConfirmation(product)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-100"
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

      {showAddForm && <AddproductForm onClose={() => setShowAddForm(false)} />}

      {/* Confirm Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          className="bg-red-100 text-red-800"
        >
          {"Confirm product Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className="mt-4">
            Are you sure you want to delete {productToDelete?.firstName}{" "}
            {productToDelete?.lastName}? This action cannot be undone.
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
            onClick={handleDeleteproduct}
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

export default PRoductsTable;
