"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatCurrency } from "@/hooks/formatcurrency";

const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const [modalLoading, setModalLoading] = useState(false);
  const [copiedId, setCopiedId] = useState("");

  // Existing helper functions remain the same
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

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(text);
      setTimeout(() => setCopiedId(""), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Existing useEffect and handlers remain the same
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/orders/${session?.user?.id}`);
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        setTransactions(data.data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchTransactions();
    }
  }, [session?.user?.id]);

  const handleViewDetails = async (transaction) => {
    setModalLoading(true);
    setSelectedTransaction(transaction);
    setModalLoading(false);
  };

  const shortenId = (id) => `${id.slice(0, 8)}...${id.slice(-4)}`;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-xl">
        <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-t-xl">
        <h1 className="text-2xl font-bold text-white">Transaction History</h1>
        <p className="text-blue-100 mt-2">Manage and track your orders</p>
      </div>

      <div className="bg-white rounded-xl my-5 shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Payment Type
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  Amount
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((transaction) => (
                <tr
                  key={transaction._id.$oid}
                  className="hover:bg-blue-50/50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(transaction.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {shortenId(transaction.payment.transactionHash)}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(transaction.payment.transactionHash)
                        }
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {copiedId === transaction.payment.transactionHash ? (
                          <span className="text-green-500 text-sm bg-green-50 px-2 py-1 rounded">
                            ✓ Copied
                          </span>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {transaction.delivery.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700">
                      {transaction.payment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-700">
                    {formatCurrency(transaction.totalAmountUSD, "en-NG", "NGN")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleViewDetails(transaction)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {modalLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-t-xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-white text-xl font-bold">
                      Order Details
                    </h2>
                    <button
                      onClick={() => setSelectedTransaction(null)}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 text-sm mb-1">
                        Transaction ID
                      </p>
                      <div className="flex items-center space-x-2">
                        <p className="font-mono font-medium">
                          {shortenId(
                            selectedTransaction.payment.transactionHash
                          )}
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              selectedTransaction.payment.transactionHash
                            )
                          }
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          {copiedId ===
                          selectedTransaction.payment.transactionHash ? (
                            <span className="text-green-500 text-sm">✓</span>
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 text-sm mb-1">Date</p>
                      <p className="font-medium">
                        {formatDate(selectedTransaction.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {selectedTransaction.items.map((item) => (
                        <div
                          key={item._id.$oid}
                          className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100"
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-semibold text-gray-800">
                                {item.productName}
                              </p>
                              <p className="text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                              <p className="text-gray-500">
                                {formatCurrency(
                                  item.unitPriceUSD,
                                  "en-NG",
                                  "NGN"
                                )}{" "}
                                each
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-800">
                            {formatCurrency(item.subtotalUSD, "en-NG", "NGN")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Delivery Information
                    </h3>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <p className="font-semibold text-gray-800 mb-2">
                        {selectedTransaction.delivery.name}
                      </p>
                      <p className="text-gray-600">
                        {selectedTransaction.delivery.email}
                      </p>
                      <p className="text-gray-600">
                        {selectedTransaction.delivery.address}
                      </p>
                      <p className="text-gray-600">
                        {selectedTransaction.delivery.city},{" "}
                        {selectedTransaction.delivery.state}{" "}
                        {selectedTransaction.delivery.zip}
                      </p>
                      <p className="text-gray-600">
                        Phone: {selectedTransaction.delivery.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <p className="text-xl font-bold text-gray-800">
                      Total Amount
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(
                        selectedTransaction.totalAmountUSD,
                        "en-NG",
                        "NGN"
                      )}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDashboard;
