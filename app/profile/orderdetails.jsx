"use client";
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

const OrderDetailsModal = ({ productOrder, isOpen, onClose }) => {
  const [copiedField, setCopiedField] = useState(null);
  const [data, setData] = useState("wi");
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Invalid date format:", error);
      return "N/A";
    }
  };

  const formatCurrency = (amount) => {
    if (amount == null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const copyToClipboard = (text, field) => {
    if (!text) return;
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("Copy to clipboard failed:", error);
    }
  };

  const truncateString = (str, maxLength = 10) => {
    if (!str) return "N/A";
    return str.length > maxLength
      ? `${str.slice(0, maxLength / 2)}...${str.slice(-maxLength / 2)}`
      : str;
  };

  if (!isOpen || !productOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              Order #{truncateString(productOrder._id?.$oid)}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 p-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Order Items
              </h3>
              <div className="flex items-center space-x-4 pb-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  {productOrder.productImage ? (
                    <img
                      src={productOrder.productImage}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">
                      {productOrder.productName ||
                        `Product ${truncateString(
                          productOrder.productId?.$oid
                        )}`}
                    </span>
                    <span className="text-gray-600">
                      Qty: {productOrder.quantity || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">
                      {formatCurrency(productOrder.unitPriceUSD)} each
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(productOrder.subtotalUSD)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t font-bold text-lg">
                <span>Total Amount:</span>
                <span>{formatCurrency(productOrder.subtotalUSD)}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Payment Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Type:</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm uppercase">
                    {productOrder.payment?.type || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 mr-2">Transaction Hash:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm bg-gray-200 rounded px-2 py-1">
                      {truncateString(
                        productOrder.payment?.transactionHash,
                        20
                      )}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          productOrder.payment?.transactionHash,
                          "transactionHash"
                        )
                      }
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {copiedField === "transactionHash" ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Order Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order ID:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    {truncateString(productOrder._id?.$oid)}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(productOrder._id?.$oid, "orderId")
                    }
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {copiedField === "orderId" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Customer ID:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    {truncateString(productOrder.customerId?.$oid)}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        productOrder.customerId?.$oid,
                        "customerId"
                      )
                    }
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {copiedField === "customerId" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Business ID:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    {truncateString(productOrder.businessId?.$oid)}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        productOrder.businessId?.$oid,
                        "businessId"
                      )
                    }
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {copiedField === "businessId" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {formatDate(productOrder.createdAt?.$date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
