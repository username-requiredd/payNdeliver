"use client"
import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { formatCurrency } from "@/hooks/formatcurrency";
import { Loader2, CopyCheck, Copy, ExternalLink, X, ChevronUp, ChevronDown } from "lucide-react";

const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const [modalLoading, setModalLoading] = useState(false);
  const [copiedId, setCopiedId] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

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
      
      // Handle nested properties
      if (sortConfig.key === 'payment.type') {
        aVal = a.payment.type;
        bVal = b.payment.type;
      } else if (sortConfig.key === 'delivery.name') {
        aVal = a.delivery.name;
        bVal = b.delivery.name;
      }

      if (typeof aVal === 'string') {
        if (sortConfig.direction === 'asc') {
          return aVal.localeCompare(bVal);
        }
        return bVal.localeCompare(aVal);
      }

      if (sortConfig.direction === 'asc') {
        return aVal - bVal;
      }
      return bVal - aVal;
    });
  }, [transactions, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUp className="w-4 h-4 opacity-0 group-hover:opacity-40" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };
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


  // ... (keep existing helper functions)

  return (
    <div className="w-full py-5 mb-5 px-5 space-y-6">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
        <p className="text-blue-100 text-lg">Track and manage your orders with ease</p>
      </div>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b">
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer group"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    Date
                    <SortIcon columnKey="createdAt" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Transaction ID</th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer group"
                  onClick={() => handleSort('delivery.name')}
                >
                  <div className="flex items-center gap-1">
                    Customer
                    <SortIcon columnKey="delivery.name" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer group"
                  onClick={() => handleSort('payment.type')}
                >
                  <div className="flex items-center gap-1">
                    Payment Type
                    <SortIcon columnKey="payment.type" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-600 cursor-pointer group"
                  onClick={() => handleSort('totalAmountUSD')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Amount
                    <SortIcon columnKey="totalAmountUSD" />
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedTransactions.map((transaction) => (
                // ... (keep existing row content)
                <tr
                key={transaction._id.$oid}
                className="hover:bg-blue-50/50 transition-colors duration-200"
              >
                <td className="px-6 py-4 text-gray-600">{formatDate(transaction.createdAt)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-full">
                      {shortenId(transaction.payment.transactionHash)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(transaction.payment.transactionHash)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {copiedId === transaction.payment.transactionHash ? (
                        <CopyCheck className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{transaction.delivery.name}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700">
                    {transaction.payment.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-medium text-gray-700">
                  {formatCurrency(transaction.totalAmountUSD, "en-NG", "NGN")}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewDetails(transaction)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors mx-auto"
                  >
                    View Details
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </td>
              </tr>

              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ... (keep existing modal content) */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {modalLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-t-xl flex justify-between items-center">
                  <h2 className="text-white text-xl font-bold">Order Details</h2>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                      <p className="text-gray-500 text-sm mb-1">Transaction ID</p>
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-medium">
                          {shortenId(selectedTransaction.payment.transactionHash)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(selectedTransaction.payment.transactionHash)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          {copiedId === selectedTransaction.payment.transactionHash ? (
                            <CopyCheck className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                      <p className="text-gray-500 text-sm mb-1">Date</p>
                      <p className="font-medium">{formatDate(selectedTransaction.createdAt)}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {selectedTransaction.items.map((item) => (
                        <div
                          key={item._id.$oid}
                          className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-20 h-20 rounded-xl object-cover shadow-sm"
                            />
                            <div>
                              <p className="font-semibold text-gray-800">{item.productName}</p>
                              <p className="text-gray-500">Quantity: {item.quantity}</p>
                              <p className="text-gray-500">
                                {formatCurrency(item.unitPriceUSD, "en-NG", "NGN")} each
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
                    <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                      <p className="font-semibold text-gray-800 mb-2">{selectedTransaction.delivery.name}</p>
                      <p className="text-gray-600">{selectedTransaction.delivery.email}</p>
                      <p className="text-gray-600">{selectedTransaction.delivery.address}</p>
                      <p className="text-gray-600">
                        {selectedTransaction.delivery.city}, {selectedTransaction.delivery.state}{" "}
                        {selectedTransaction.delivery.zip}
                      </p>
                      <p className="text-gray-600">Phone: {selectedTransaction.delivery.phone}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <p className="text-xl font-bold text-gray-800">Total Amount</p>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(selectedTransaction.totalAmountUSD, "en-NG", "NGN")}
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