"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Copy, Loader2 } from "lucide-react";
import { formatCurrency } from "@/hooks/formatcurrency";

const OrderDetailsModal = ({ id, onClose }) => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // Utility Functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shortenText = (text, maxLength = 10) => {
    if (!text) return "N/A";
    return text.length > maxLength
      ? `${text.slice(0, 5)}...${text.slice(-5)}`
      : text;
  };

  // Clipboard Copy Function
  const copyToClipboard = useCallback((text, fieldName) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  }, []);

  // Fetch Order Details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) {
        setError("No Order ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/orders/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        console.log(data.data);
        setOrder(data.data || null);
        setError(null);
      } catch (err) {
        console.error("Order fetch error:", err);
        setError(err.message || "An unexpected error occurred");
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const renderCopyableField = (value, fieldName) => (
    <div className="flex items-center relative group">
      <span className="mr-2 text-gray-700">{shortenText(value)}</span>
      <button
        onClick={() => copyToClipboard(value, fieldName)}
        className="text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
        title={`Copy ${fieldName}`}
      >
        <Copy size={14} />
      </button>
      {copiedField === fieldName && (
        <span className="absolute -top-5 left-0 text-xs text-green-600 animate-bounce">
          Copied!
        </span>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
          <h2 className="text-red-600 text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 flex justify-between items-center p-8 border-b">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Order Details
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 transition-all duration-200"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 space-y-8">
          {/* Product and Order Information */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Product Information
              </h3>
              <div className="space-y-4">
                {order?.items?.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex gap-4 p-4">
                      <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={item.productImage || "/api/placeholder/400/400"}
                          alt={item.productName}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-lg text-gray-900 mb-1 truncate">
                          {item.productName || "N/A"}
                        </p>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                          {item.productDescription || "No description"}
                        </p>
                        <p className="text-sm text-gray-500">
                          from:{" "}
                          <span className="font-medium">{item.storeName}</span>
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4">
                      <div>
                        <span className="text-xs text-gray-500 block mb-1">
                          Quantity
                        </span>
                        <p className="font-medium text-gray-900">
                          {item.quantity || 0}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-500 block">
                            Unit Price
                          </span>
                          <p className="font-medium text-green-600">
                            {formatCurrency(item.unitPriceUSD)}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block">
                            Total
                          </span>
                          <p className="font-medium text-green-600">
                            {formatCurrency(item.subtotalUSD)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Order Summary
              </h3>
              <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-500">Order ID</span>
                      {renderCopyableField(order?._id)}
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        Total Amount
                      </span>
                      <p className="font-bold text-3xl text-green-600 mt-1">
                        {formatCurrency(order?.totalAmountUSD)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Order Date</span>
                      <p className="text-gray-900 mt-1">
                        {formatDate(order?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Payment Details
            </h3>
            <div className="bg-blue-50 rounded-2xl p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Payment Type</p>
                  <p className="font-medium capitalize text-gray-900">
                    {order?.payment?.type || "N/A"}
                  </p>
                </div>
                {order?.payment?.type === "cash" && (
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Card</p>
                    <p className="font-medium text-gray-900">
                      **** **** **** {order.payment?.cardLastFour || "0000"}
                    </p>
                  </div>
                )}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Transaction Hash</p>
                  {renderCopyableField(order.payment?.transactionHash)}
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Shipping Details
            </h3>
            <div className="bg-green-50 rounded-2xl p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Shipping Method</p>
                  <p className="font-medium text-gray-900">
                    {order?.shipping?.method || "Standard"}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                  {renderCopyableField(order?._id)}
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">
                    Estimated Delivery
                  </p>
                  <p className="font-medium text-gray-900">
                    {order?.shipping?.estimatedDelivery
                      ? formatDate(order.shipping.estimatedDelivery)
                      : "1 hrs"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Delivery Address
            </h3>
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="font-semibold text-xl text-gray-900 mb-4">
                  {order?.delivery?.name || "N/A"}
                </p>
                <div className="space-y-2 text-gray-600">
                  <p>{order?.delivery?.address || "N/A"}</p>
                  <p>
                    {order?.delivery?.city || "N/A"},{" "}
                    {order?.delivery?.state || "N/A"}{" "}
                    {order.delivery?.zip || ""}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Email:</span>
                    <span className="text-gray-900">
                      {order?.delivery?.email || "N/A"}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Phone:</span>
                    <span className="text-gray-900">
                      {order?.delivery?.phone || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
