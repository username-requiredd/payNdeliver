"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const REDIRECT_DELAY = 2000;

export default function EditProduct({ params }) {
  const router = useRouter();
  const [state, setState] = useState({
    product: null,
    loading: false,
    error: "",
    success: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    instock: "",
    category: "",
    image: "",
  });

  const fetchProduct = async (id, signal) => {
    try {
      const response = await fetch(`/api/products/${id}`, { signal });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to fetch");

      const { name, price, instock, category, image } = data.data;
      setState((prev) => ({ ...prev, product: data.data }));
      setFormData({ name, price, instock, category, image });
    } catch (err) {
      if (err.name !== "AbortError") {
        setState((prev) => ({ ...prev, error: err.message }));
      }
    }
  };

  useEffect(() => {
    if (!params?.id) {
      setState((prev) => ({ ...prev, error: "Product ID is missing" }));
      return;
    }

    const controller = new AbortController();
    fetchProduct(params.id, controller.signal);

    return () => controller.abort();
  }, [params?.id]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.name.trim()) errors.push("Name is required");
    if (parseFloat(formData.price) < 0) errors.push("Price must be positive");
    if (parseInt(formData.instock) < 0) errors.push("Stock must be positive");
    if (!formData.category.trim()) errors.push("Category is required");
    if (!formData.image.trim()) errors.push("Image URL is required");

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (errors.length) {
      setState((prev) => ({ ...prev, error: errors.join(", ") }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: "", success: false }));

    try {
      const updatedData = {
        ...formData,
        price: parseFloat(formData.price),
        instock: parseInt(formData.instock),
      };

      const response = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Update failed");

      setState((prev) => ({ ...prev, success: true }));
      setTimeout(() => router.push("/products"), REDIRECT_DELAY);
    } catch (err) {
      setState((prev) => ({ ...prev, error: err.message }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const formFields = useMemo(
    () => [
      { name: "name", label: "Product Name", type: "text" },
      { name: "price", label: "Price", type: "number", step: "0.01", min: "0" },
      { name: "instock", label: "Stock Quantity", type: "number", min: "0" },
      { name: "category", label: "Category", type: "text" },
      { name: "image", label: "Image URL", type: "text" },
    ],
    []
  );

  if (!state.product && !state.error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h1>

        {state.error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">
            {state.error}
          </div>
        )}

        {state.success && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded">
            Product updated successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.map(({ name, label, type, ...props }) => (
            <div key={name} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                required
                {...props}
              />
            </div>
          ))}

          {formData.image && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Current Image Preview:</p>
              <Image
                src={formData.image}
                alt="Product preview"
                width={200}
                height={200}
                className="rounded-lg shadow-sm"
              />
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/products")}
              disabled={state.loading}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={state.loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {state.loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
