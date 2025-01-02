"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  Wallet,
  Banknote,
  Calendar,
  Globe,
  Building,
  Trash2,
  AlertTriangle,
  X,
  Save,
} from "lucide-react";
import ProductsDetailsModal from "./productsDetails";
import ProductCard from "@/components/productscard";
import BusinessDetailsSkeleton from "./businessprofileskeleton";
import StorePerformancePage from "./storeperformancematric";

const BusinessDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    phone: "",
    email: "",
    address: "",
    walletAddress: "",
    accountName: "",
    accountNumber: "",
    businessType: "",
  });

  const handleProductDetails = useCallback(
    (productId) => {
      const product = products.find((prod) => productId === prod._id);
      if (product) {
        const transformedProduct = {
          ...product,
          id: product._id,
        };
        setSelectedProduct(transformedProduct);
        setIsModalOpen(true);
        return transformedProduct;
      }
    },
    [products]
  );

  const fetchBusinessAndProducts = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        setError(null);

        const businessResponse = await fetch(`/api/business/${id}`, { signal });
        if (!businessResponse.ok) {
          throw new Error(
            businessResponse.status === 404
              ? "Business not found"
              : "Error fetching business profile"
          );
        }

        const businessData = await businessResponse.json();
        if (!businessData?.data) {
          throw new Error("Invalid business data received");
        }

        setBusiness(businessData.data);
        setFormData({
          businessName: businessData.data.businessName,
          phone: businessData.data.phone,
          email: businessData.data.email,
          address: businessData.data.address,
          walletAddress: businessData.data.walletAddress,
          accountName: businessData.data.accountName,
          accountNumber: businessData.data.accountNumber,
          businessType: businessData.data.businessType,
        });

        if (businessData.data?._id) {
          const productsResponse = await fetch(
            `/api/products/${businessData.data._id}`,
            { signal }
          );
          if (!productsResponse.ok) {
            throw new Error("Error fetching products");
          }

          const productsData = await productsResponse.json();
          setProducts(productsData.data || []);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    const abortController = new AbortController();
    if (id) {
      fetchBusinessAndProducts(abortController.signal);
    }
    return () => abortController.abort();
  }, [fetchBusinessAndProducts, id]);

  const handleDeleteBusiness = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/business/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the business");
      }

      router.push("/dashboards/admin/managebusiness/");
    } catch (error) {
      console.error("Error deleting business:", error);
      alert("Failed to delete the business. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      businessName: business.businessName,
      phone: business.phone,
      email: business.email,
      address: business.address,
      walletAddress: business.walletAddress,
      accountName: business.accountName,
      accountNumber: business.accountNumber,
      businessType: business.businessType,
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/business/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update the business");
      }

      const updatedBusiness = await response.json();
      setBusiness(updatedBusiness.data);
      setIsEditing(false);
      alert("Business updated successfully!");
    } catch (error) {
      console.error("Error updating business:", error);
      alert("Failed to update the business. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <BusinessDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-xl font-semibold text-gray-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-xl text-gray-600">Business not found</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      const date = dateString.$date
        ? new Date(dateString.$date)
        : new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (err) {
      return "Invalid date";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {isModalOpen && selectedProduct && (
        <ProductsDetailsModal
          {...selectedProduct}
          _id={selectedProduct._id || selectedProduct.id}
          onClose={() => setIsModalOpen(false)}
        />
      )}

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
                  Are you sure you want to delete this business? This action
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
                onClick={handleDeleteBusiness}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative h-64">
            {business.coverImage ? (
              <img
                src={business.coverImage}
                alt={`${business.businessName} cover`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
                <Building className="w-24 h-24 text-white/50" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              {isEditing ? (
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="text-4xl font-bold text-white bg-transparent border-b border-white focus:outline-none"
                >
                  <option value="Restaurant">Restaurant</option>
                  <option value="Grocery">Grocery</option>
                  <option value="Retail">Retail</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Others">Others</option>
                </select>
              ) : (
                <h1 className="text-4xl font-bold text-white">
                  {business.businessName}
                </h1>
              )}
              <p className="text-white/90 mt-2 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                {isEditing ? (
                  <input
                    type="text"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="bg-transparent border-b border-white focus:outline-none"
                  />
                ) : (
                  business.businessType || "No business type specified"
                )}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Phone, label: "Phone", value: "phone" },
                { icon: Mail, label: "Email", value: "email" },
                { icon: MapPin, label: "Address", value: "address" },
                {
                  icon: Wallet,
                  label: "Wallet Address",
                  value: "walletAddress",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icon className="w-6 h-6 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">{label}</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name={value}
                        value={formData[value]}
                        onChange={handleChange}
                        className="bg-transparent border-b border-gray-300 focus:outline-none"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium break-all">
                        {business[value] || "N/A"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="p-6 border-t flex items-center gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <Save className="w-5 h-5" />
                  <span className="font-medium">Save</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <X className="w-5 h-5" />
                  <span className="font-medium">Cancel</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="font-medium">Delete Business</span>
                </button>
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Save className="w-5 h-5" />
                  <span className="font-medium">Edit</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bank Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Banknote className="w-6 h-6 text-blue-600 mr-2" />
            Bank Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Account Name</p>
              {isEditing ? (
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  className="bg-transparent border-b border-gray-300 focus:outline-none"
                />
              ) : (
                <p className="text-gray-900 font-medium">
                  {business.accountName || "N/A"}
                </p>
              )}
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Account Number</p>
              {isEditing ? (
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="bg-transparent border-b border-gray-300 focus:outline-none"
                />
              ) : (
                <p className="text-gray-900 font-medium">
                  {business.accountNumber || "N/A"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Opening Hours Card */}
        {business.openingHours && business.openingHours.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Clock className="w-6 h-6 text-blue-600 mr-2" />
              Opening Hours
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.openingHours.map((hour, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <p className="text-gray-900 font-medium">{hour.day}</p>
                  <p className="text-gray-600">
                    {hour.openingTime} - {hour.closingTime}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Section */}
        {products.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg
                className="w-6 h-6 text-blue-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  onclick={() => handleProductDetails(product._id)}
                  {...product}
                />
              ))}
            </div>
          </div>
        )}
        {/* performance matric */}
        <div className="bg-white rounded-lg shadow-lg p-6 my-8">
          <StorePerformancePage />
        </div>
        {/* Footer with Dates */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Business registered on {formatDate(business.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsPage;
