"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Chip,
  TextField,
  Typography,
  Alert,
  Paper,
  Grid,
  Autocomplete,
} from "@mui/material";
import { Camera, Loader } from "lucide-react";
import ImageUpload from "@/components/Imageupload";

const UploadBox = styled(Box)(({ theme }) => ({
  height: 250,
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  borderStyle: "dashed",
  borderWidth: 2,
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.default,
  transition: "border-color 0.3s, background-color 0.3s",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
}));

const EditProduct = ({ id }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product data");
        const data = await response.json();
        setProductData(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setSubmitError("Failed to load product data.");
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (field) => (event) => {
    setProductData({ ...productData, [field]: event.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleImageUpload = (url) => {
    setProductData({ ...productData, image: url });
  };

  const handleMultipleChange = (field) => (event, newValue) => {
    setProductData({ ...productData, [field]: newValue });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!productData.name) newErrors.name = "Product name is required";
    if (!productData.price) newErrors.price = "Price is required";
    if (!productData.stock) newErrors.stock = "Stock is required";

    if (productData.price && isNaN(Number(productData.price))) {
      newErrors.price = "Price must be a number";
    }
    if (productData.stock && isNaN(Number(productData.stock))) {
      newErrors.stock = "Stock must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitError("");
    setSubmitSuccess(false);

    if (!validateForm()) return;

    try {
      const formattedData = {
        name: productData.name,
        description: productData.description,
        price: Number(productData.price),
        category: productData.category,
        image: productData.image,
        stock: Number(productData.stock),
      };

      setLoading(true);
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      setLoading(false);
      setSubmitSuccess(true);
    } catch (error) {
      setLoading(false);
      console.error("Error updating product:", error);
      setSubmitError(
        error.message || "An error occurred while updating the product."
      );
    }
  };


  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 5, mb: 8 }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: 700, color: "primary.main" }}
      >
        Edit Product
      </Typography>

      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Product successfully updated!
        </Alert>
      )}

      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}

      <StyledPaper>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Cover Image
            </Typography>
            <UploadBox>
              {productData.image ? (
                <img
                  src={productData.image}
                  alt="Cover"
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <Camera size={48} color="#9e9e9e" />
              )}
              <ImageUpload onImageUpload={handleImageUpload} />
              <Typography
                variant="caption"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                PNG, JPG, GIF up to 10MB
              </Typography>
            </UploadBox>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Product Name"
              variant="outlined"
              fullWidth
              value={productData.name}
              onChange={handleChange("name")}
              error={!!errors.name}
              helperText={errors.name}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Product Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={productData.description}
              onChange={handleChange("description")}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={[]}
              freeSolo
              value={productData.category}
              onChange={handleMultipleChange("category")}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Product Category"
                  placeholder="Add category"
                  helperText="Type and press enter to add category"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              value={productData.price}
              onChange={handleChange("price")}
              type="number"
              error={!!errors.price}
              helperText={errors.price}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Stock"
              variant="outlined"
              fullWidth
              value={productData.stock}
              onChange={handleChange("stock")}
              type="number"
              error={!!errors.stock}
              helperText={errors.stock}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                {loading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  "Update Product"
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>
    </Box>
  );
};

export default EditProduct;
