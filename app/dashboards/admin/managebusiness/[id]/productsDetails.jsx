"use client";
import React, { useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";

const formatCurrency = (amount, locale = "en-US", currency = "NGN") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const ProductsDetailsModal = ({
  name,
  price,
  onClose,
  _id,
  description,
  image,
  instock,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete the product: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Product deleted successfully:", data);
      return data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      await deleteProduct(id);
      console.log("Product deleted");
      setIsDeleteModalOpen(false);
      onClose(true);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete the product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Product Details Modal */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">{name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Product Image */}
          <div className="mb-6">
            <img
              src={image}
              alt={name}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <p className="text-gray-700">{description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(price, "en-NG", "NGN")}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  instock
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {instock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete Product</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Confirm Deletion
              </h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <p className="text-gray-700">
                  Are you sure you want to delete this product? This action
                  cannot be undone.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-4 border-t space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(_id)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsDetailsModal;
