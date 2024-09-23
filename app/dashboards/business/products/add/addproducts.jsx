"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import styled from "@emotion/styled";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { Camera } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { categories } from "./categories";

const UploadBox = styled(Box)({
  marginTop: 32,
  height: 200,
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  borderStyle: "dashed",
  borderWidth: 2,
  borderColor: "#e0e0e0",
  backgroundColor: "#f5f5f5",
  transition: "border-color 0.3s",
  "&:hover": {
    borderColor: "#1976d2",
  },
});

const AddProduct = () => {
  const { data: session } = useSession();
  const businessId = session?.user?.id;

  const [productData, setProductData] = useState({
    productName: "",
    description: "",
    category: "",
    tags: [],
    brand: "",
    price: "",
    stock: "",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle input changes for form fields
  const handleChange = (field) => (event) => {
    setProductData({ ...productData, [field]: event.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // Handle image URL update after upload
  const handleImageUpload = (url) => {
    setProductData({ ...productData, image: url });
  };

  // Handle tags change
  const handleTagsChange = (event, newValue) => {
    setProductData({ ...productData, tags: newValue });
  };

  // Form validation logic
  const validateForm = () => {
    const newErrors = {};
    if (!productData.productName)
      newErrors.productName = "Product name is required";
    if (!productData.price) newErrors.price = "Price is required";
    if (!productData.category) newErrors.category = "Category is required";
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

  // Submit product data
  const handleSubmit = async () => {
    setSubmitError("");
    setSubmitSuccess(false);

    if (!validateForm()) return;

    try {
      const formattedData = {
        name: productData.productName,
        description: productData.description,
        price: Number(productData.price),
        category: productData.category,
        image: productData.image, // Make sure image URL is set
        instock: Number(productData.stock),
        tags: productData.tags,
        brand: productData.brand,
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Product submitted successfully:", result);

      setSubmitSuccess(true);
      // Reset form data
      setProductData({
        productName: "",
        description: "",
        category: "",
        tags: [],
        brand: "",
        price: "",
        stock: "",
        image: "",
      });
    } catch (error) {
      console.error("Error submitting product:", error);
      setSubmitError(
        error.message || "An error occurred while submitting the product."
      );
    }
  };

  return (
    <Box sx={{ pb: 3, mt: 5 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Add New Product
      </Typography>

      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Product successfully added!
        </Alert>
      )}

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Box sx={{ mb: 8 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
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
            <Camera sx={{ fontSize: 48, color: "text.secondary" }} />
          )}
          {/* ImageUpload component with image URL setter */}
          <ImageUpload onImageUpload={handleImageUpload} />
          <Typography variant="caption" sx={{ mt: 1, color: "text.secondary" }}>
            PNG, JPG, GIF up to 10MB
          </Typography>
        </UploadBox>
      </Box>

      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          p: 3,
          maxWidth: 800,
          mx: "auto",
        }}
      >
        <TextField
          label="Product Name"
          variant="outlined"
          fullWidth
          value={productData.productName}
          onChange={handleChange("productName")}
          error={!!errors.productName}
          helperText={errors.productName}
          sx={{ mb: 3 }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Product Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={productData.description}
          onChange={handleChange("description")}
          sx={{ mb: 3 }}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth sx={{ mb: 3 }} error={!!errors.category}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category-select"
            value={productData.category}
            onChange={handleChange("category")}
            label="Category"
          >
            {categories?.map(({ category_id, name }) => (
              <MenuItem value={name} key={category_id}>
                {name}
              </MenuItem>
            ))}
          </Select>
          {errors.category && (
            <Typography color="error" variant="caption">
              {errors.category}
            </Typography>
          )}
        </FormControl>

        <Autocomplete
          multiple
          options={categories.map((option) => option.name)}
          value={productData.tags}
          onChange={handleTagsChange}
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
              label="Product Tags"
              placeholder="Product Tags"
              helperText="Select a tag or type and press enter"
              InputLabelProps={{ shrink: true }}
            />
          )}
          sx={{ mb: 3 }}
        />

        <TextField
          label="Brand"
          variant="outlined"
          fullWidth
          value={productData.brand}
          onChange={handleChange("brand")}
          sx={{ mb: 3 }}
          InputLabelProps={{ shrink: true }}
        />

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
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
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              borderRadius: 4,
              px: 4,
              py: 1,
            }}
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddProduct;
