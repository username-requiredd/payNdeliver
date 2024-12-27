import { useState, useEffect, useCallback } from "react";

const initialProductState = {
  name: "",
  description: "",
  price: "",
  category: [],
  image: "",
  instock: "",
};

export const useProductDetails = ({ id, session }) => {
  // State
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [productData, setProductData] = useState(initialProductState);
  const [editedData, setEditedData] = useState(initialProductState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ error: "", success: false });
  const [imageUploading, setImageUploading] = useState(false);

  // Fetch product data
  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch product");
        }

        if (isMounted && data.data?.[0]) {
          const productWithDefaults = {
            ...initialProductState,
            ...data.data[0],
            category: data.data[0]?.category || [],
          };
          setProductData(productWithDefaults);
          setEditedData(productWithDefaults);
        }
      } catch (error) {
        setStatus((prev) => ({
          ...prev,
          error: "Failed to load product data",
        }));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Reset all state
  const resetState = useCallback(() => {
    setIsEditing(false);
    setEditedData(productData);
    setErrors({});
    setStatus({ error: "", success: false });
  }, [productData]);

  // Handle input changes
  const handleInputChange = useCallback((field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  // Handle edit mode
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditedData(productData);
    setErrors({});
    setStatus({ error: "", success: false });
  }, [productData]);

  // Handle cancel editing
  const handleCancel = useCallback(() => {
    if (JSON.stringify(editedData) !== JSON.stringify(productData)) {
      if (window.confirm("Are you sure you want to discard your changes?")) {
        resetState();
      }
    } else {
      resetState();
    }
  }, [editedData, productData, resetState]);

  // Handle image upload
  const handleImageUpload = useCallback(
    async (url) => {
      try {
        setImageUploading(true);
        if (!url) throw new Error("No image URL provided");
        handleInputChange("image", url);
      } catch (error) {
        setStatus((prev) => ({ ...prev, error: "Failed to upload image" }));
      } finally {
        setImageUploading(false);
      }
    },
    [handleInputChange]
  );

  // Handle category changes
  const handleCategoryChange = useCallback(
    (event) => {
      if (event.key === "Enter" && event.target.value.trim()) {
        event.preventDefault();
        const value = event.target.value.trim();

        if (value.length > 50) {
          setErrors((prev) => ({
            ...prev,
            category: "Category name too long",
          }));
          return;
        }

        if (editedData.category.includes(value)) {
          setErrors((prev) => ({
            ...prev,
            category: "Category already exists",
          }));
          return;
        }

        setEditedData((prev) => ({
          ...prev,
          category: [...prev.category, value],
        }));
        event.target.value = "";
        setErrors((prev) => ({ ...prev, category: "" }));
      }
    },
    [editedData.category]
  );

  // Handle category removal
  const handleRemoveCategory = useCallback((categoryToRemove) => {
    setEditedData((prev) => ({
      ...prev,
      category: prev.category.filter((cat) => cat !== categoryToRemove),
    }));
  }, []);

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    const { name, price, instock } = editedData;

    if (!name?.trim()) newErrors.name = "Name is required";
    if (!price) newErrors.price = "Price is required";
    if (!instock) newErrors.instock = "Stock quantity is required";

    const numPrice = Number(price);
    const numInstock = Number(instock);

    if (isNaN(numPrice) || numPrice < 0 || numPrice > 999999.99) {
      newErrors.price = "Price must be between 0 and 999,999.99";
    }

    if (isNaN(numInstock) || numInstock < 0 || !Number.isInteger(numInstock)) {
      newErrors.instock = "Stock must be a positive whole number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [editedData]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setStatus({ error: "", success: false });

      if (!validateForm()) return;

      try {
        setLoading(true);
        const formattedData = {
          ...editedData,
          price: Number(editedData.price),
          instock: Number(editedData.instock),
        };

        const response = await fetch(`/api/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(session?.accessToken && {
              Authorization: `Bearer ${session.accessToken}`,
            }),
          },
          body: JSON.stringify(formattedData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to update product");
        }

        setProductData(formattedData);
        setStatus({ error: "", success: true });
        setIsEditing(false);
      } catch (error) {
        setStatus({
          error: error.message || "Failed to update product",
          success: false,
        });
      } finally {
        setLoading(false);
      }
    },
    [editedData, id, session?.accessToken, validateForm]
  );

  return {
    state: {
      loading,
      isEditing,
      productData,
      editedData,
      errors,
      status,
      imageUploading,
    },
    actions: {
      handleInputChange,
      handleEdit,
      handleCancel,
      handleSubmit,
      handleImageUpload,
      handleCategoryChange,
      handleRemoveCategory,
    },
  };
};
