import Image from "next/image";
import { X, Package, Clock, DollarSign, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/hooks/formatcurrency";

const CustomerModal = ({ isOpen, onClose, customer, orders }) => {
  if (!isOpen) return null;

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

  const getStatusColor = (status) => {
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-2xl">
            <div className="flex h-full flex-col bg-white shadow-xl">
              {/* Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Customer Profile
                  </h2>
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Customer Info */}
                <div className="px-6 py-8 border-b border-gray-200 bg-white">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Image
                        src="/images/profile-placeholder.png"
                        alt={customer?.customer}
                        width={96}
                        height={96}
                        className="rounded-full ring-4 ring-gray-100"
                      />
                      <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-400 border-2 border-white"></div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {customer?.customer}
                      </h3>
                      <p className="text-gray-500">{customer?.email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{customer?.phone}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium truncate">
                          {customer?.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orders */}
                <div className="px-6 py-6">
                  <h3 className="text-lg font-semibold mb-4">Order History</h3>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <Package className="w-5 h-5 text-gray-400" />
                              <span className="font-medium">
                                {order.productId}
                              </span>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                "paid"
                              )}`}
                            >
                              Paid
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">N/A</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-900 font-medium">
                                {formatCurrency(
                                  order.subtotalUSD.toFixed(2),
                                  "en-NG",
                                  "NGN"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No orders
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        This customer hasn't made any orders yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 
                    transition-colors duration-200 focus:outline-none focus:ring-2 
                    focus:ring-gray-900 focus:ring-offset-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;
