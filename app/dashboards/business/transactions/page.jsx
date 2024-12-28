"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { formatCurrency } from "@/hooks/formatcurrency";
import {
  Loader2,
  CopyCheck,
  Copy,
  ExternalLink,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const TransactionSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded-full w-32" />
    </td>
    <td className="px-6 py-4">
      <div className="h-8 bg-gray-200 rounded-full w-48" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded-full w-24" />
    </td>
    <td className="px-6 py-4">
      <div className="h-6 bg-gray-200 rounded-full w-20" />
    </td>
    <td className="px-6 py-4 text-right">
      <div className="h-4 bg-gray-200 rounded-full w-24 ml-auto" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded-full w-24 mx-auto" />
    </td>
  </tr>
);

const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const [modalLoading, setModalLoading] = useState(false);
  const [copiedId, setCopiedId] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  // ... (keep existing helper functions)
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

  const sortedTransactions = useMemo(() => {
    const sorted = [...transactions];
    return sorted.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === "payment.type") {
        aVal = a.payment.type;
        bVal = b.payment.type;
      } else if (sortConfig.key === "delivery.name") {
        aVal = a.delivery.name;
        bVal = b.delivery.name;
      }

      if (typeof aVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [transactions, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUp className="w-4 h-4 opacity-0 group-hover:opacity-40" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
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

  const shortenId = (id) => `${id.slice(0, 8)}...${id.slice(-4)}`;

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

  return (
    <div className="w-full py-8 px-6 space-y-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">
            Manage Orders
          </h1>
          <p>Track and manage orders and payments..</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {[
                  "Date",
                  "Transaction ID",
                  "Customer",
                  "Payment Type",
                  "Amount",
                  "Actions",
                ].map((header, index) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer group"
                    onClick={() =>
                      [
                        "createdAt",
                        "transactionHash",
                        "delivery.name",
                        "payment.type",
                        "totalAmountUSD",
                      ][index] &&
                      handleSort(
                        [
                          "createdAt",
                          "transactionHash",
                          "delivery.name",
                          "payment.type",
                          "totalAmountUSD",
                        ][index]
                      )
                    }
                  >
                    <div
                      className={`flex items-center gap-1 ${
                        index === 4 ? "justify-end" : ""
                      } ${index === 5 ? "justify-center" : ""}`}
                    >
                      {header}
                      {index < 5 && (
                        <SortIcon
                          columnKey={
                            [
                              "createdAt",
                              "transactionHash",
                              "delivery.name",
                              "payment.type",
                              "totalAmountUSD",
                            ][index]
                          }
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array(5)
                    .fill(0)
                    .map((_, i) => <TransactionSkeleton key={i} />)
                : sortedTransactions.map((transaction) => (
                    <tr
                      key={transaction._id.$oid}
                      className="hover:bg-blue-50/50 transition-all duration-200"
                    >
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-sm bg-gray-100 px-3 py-1.5 rounded-full">
                            {shortenId(transaction.payment.transactionHash)}
                          </code>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                transaction.payment.transactionHash
                              )
                            }
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            {copiedId ===
                            transaction.payment.transactionHash ? (
                              <CopyCheck className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {transaction.delivery.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                          {transaction.payment.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-700">
                        {formatCurrency(
                          transaction.totalAmountUSD,
                          "en-NG",
                          "NGN"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewDetails(transaction)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors mx-auto group"
                        >
                          <span>View Details</span>
                          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {modalLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-t-2xl flex justify-between items-center">
                  <h2 className="text-white text-xl font-bold">
                    Order Details
                  </h2>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="text-white/80 hover:text-white transition-colors hover:rotate-90 duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                      <p className="text-gray-500 text-sm mb-2">
                        Transaction ID
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-medium">
                          {shortenId(
                            selectedTransaction.payment.transactionHash
                          )}
                        </code>
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
                            <CopyCheck className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                      <p className="text-gray-500 text-sm mb-2">Date</p>
                      <p className="font-medium">
                        {formatDate(selectedTransaction.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-6">Order Items</h3>
                    <div className="space-y-4">
                      {selectedTransaction.items.map((item) => (
                        <div
                          key={item._id.$oid}
                          className="flex items-center justify-between bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:translate-x-1"
                        >
                          <div className="flex items-center gap-6">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-24 h-24 rounded-xl object-cover shadow-sm hover:shadow-md transition-shadow duration-200"
                            />
                            <div>
                              <p className="font-semibold text-gray-800 mb-2">
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
                    <h3 className="text-lg font-semibold mb-6">
                      Delivery Information
                    </h3>
                    <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                      <p className="font-semibold text-gray-800 text-lg mb-4">
                        {selectedTransaction.delivery.name}
                      </p>
                      <div className="space-y-2 text-gray-600">
                        <p>{selectedTransaction.delivery.email}</p>
                        <p>{selectedTransaction.delivery.address}</p>
                        <p>
                          {selectedTransaction.delivery.city},{" "}
                          {selectedTransaction.delivery.state}{" "}
                          {selectedTransaction.delivery.zip}
                        </p>
                        <p>Phone: {selectedTransaction.delivery.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(
                          selectedTransaction.totalAmountUSD,
                          "en-NG",
                          "NGN"
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      Print Receipt
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 text-red-700 px-6 py-4 rounded-xl shadow-lg border border-red-100 animate-slide-up">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <p className="font-medium">Error loading transactions: {error}</p>
          </div>
        </div>
      )}

      {copiedId && (
        <div className="fixed bottom-4 left-4 bg-green-50 text-green-700 px-6 py-4 rounded-xl shadow-lg border border-green-100 animate-slide-up">
          <div className="flex items-center gap-2">
            <CopyCheck className="w-4 h-4" />
            <p className="font-medium">Transaction ID copied to clipboard</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDashboard;
