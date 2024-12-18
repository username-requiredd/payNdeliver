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

  // Render Helpers
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

  // Render Loading or Error State
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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto relative">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
          <h2 className="text-3xl font-bold text-gray-800">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 hover:rotate-90 transition-all"
          >
            <X size={28} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Product and Order Information */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Product Details */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Product Information
              </h3>
              <div className="bg-gray-50 p-5 rounded-xl space-y-6">
                {order.items?.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-24 h-24 mr-4 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={item.productImage || "/api/placeholder/400/400"}
                          alt={item.productName || "Product"}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-lg mb-1">
                          {item.productName || "N/A"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {item.description || "No description"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-t pt-2">
                      <div>
                        <span className="text-xs text-gray-500">Quantity</span>
                        <p className="font-medium">{item.quantity || 0}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">
                          Unit Price
                        </span>
                        <p className="font-medium text-green-600">
                          {formatCurrency(item.unitPriceUSD)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Order Information
              </h3>
              <div className="bg-gray-50 p-5 rounded-xl space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="mb-3">
                    <span className="text-xs text-gray-500 block mb-1">
                      Order ID
                    </span>
                    {renderCopyableField(order._id, "id")}
                  </div>
                  <div className="mb-3">
                    <span className="text-xs text-gray-500 block mb-1">
                      Total Amount
                    </span>
                    <p className="font-bold text-2xl text-green-600">
                      {formatCurrency(order.totalAmountUSD)}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">
                      Created At
                    </span>
                    <p className="text-gray-700">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Payment Details
            </h3>
            <div className="bg-blue-50 p-5 rounded-xl grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Payment Type</p>
                <p className="font-medium capitalize">
                  {order.payment?.type || "N/A"}
                </p>
              </div>
              <div
                className={`bg-white p-4 rounded-lg shadow-sm ${
                  order.payment?.type === "cash" ? "block" : " hidden"
                }`}
              >
                <p className="text-xs text-gray-500 mb-1">Card</p>
                <p className="font-medium">
                  **** **** **** {order.payment?.cardLastFour || "0000"}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
                <p className="font-medium text-sm truncate">
                  {renderCopyableField(
                    order.payment?.transactionHash,
                    "Transaction Hash"
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Shipping Details
            </h3>
            <div className="bg-green-50 p-5 rounded-xl grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Shipping Method</p>
                <p className="font-medium">
                  {order.shipping?.method || "Standard"}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Tracking Number</p>
                <p className="font-medium">
                  {renderCopyableField(order._id, "id")}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Estimated Delivery</p>
                <p className="font-medium">
                  {order.shipping?.estimatedDelivery
                    ? new Date(
                        order.shipping.estimatedDelivery
                      ).toLocaleDateString()
                    : "1 hrs"}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Delivery Address
            </h3>
            <div className="bg-gray-50 p-5 rounded-xl">
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <p className="font-semibold text-lg mb-2">
                  {order.delivery?.name || "N/A"}
                </p>
                <p className="text-gray-600 mb-1">
                  {order.delivery?.address || "N/A"}
                </p>
                <p className="text-gray-600 mb-1">
                  {order.delivery?.city || "N/A"},{" "}
                  {order.delivery?.state || "N/A"} {order.delivery?.zip || ""}
                </p>
                <div className="mt-3 pt-3 border-t">
                  <p className="mb-1">
                    <span className="text-xs text-gray-500 mr-2">Email:</span>
                    {order.delivery?.email || "N/A"}
                  </p>
                  <p>
                    <span className="text-xs text-gray-500 mr-2">Phone:</span>
                    {order.delivery?.phone || "N/A"}
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
