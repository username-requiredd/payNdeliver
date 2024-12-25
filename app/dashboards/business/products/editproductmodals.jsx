"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Close, Camera } from "lucide-react";
import Image from "next/image";
import ImageUpload from "@/components/Imageupload";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditProductModal({ open, onClose, product }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    instock: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        instock: product.instock || "",
        category: product.category || "",
        image: product.image || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Product updated successfully!");
        onClose(true); // Pass true to indicate successful update
      } else {
        throw new Error(data.message || "Failed to update product");
      }
    } catch (err) {
      setError(err.message || "An error occurred while updating the product");
      toast.error(err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        <span>Edit Product</span>
        <IconButton onClick={() => onClose(false)} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <div className="space-y-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <ImageUpload
                      onImageUpload={(url) =>
                        setFormData((prev) => ({
                          ...prev,
                          image: url,
                        }))
                      }
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {formData.image && (
              <Box className="mt-4 mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Current Image:
                </p>
                <div className="relative w-48 h-48">
                  <Image
                    src={formData.image}
                    alt="Product preview"
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              </Box>
            )}

            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              variant="outlined"
              inputProps={{ step: "0.01", min: "0" }}
            />

            <TextField
              fullWidth
              label="Stock Quantity"
              name="instock"
              type="number"
              value={formData.instock}
              onChange={handleChange}
              required
              variant="outlined"
              inputProps={{ min: "0" }}
            />

            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </div>
        </DialogContent>

        <DialogActions className="p-4">
          <Button
            variant="outlined"
            onClick={() => onClose(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} className="mr-2" />
                Updating...
              </>
            ) : (
              "Update Product"
            )}
          </Button>
        </DialogActions>
      </form>
      <ToastContainer />
    </Dialog>
  );
}
