import React from "react";
import Link from "next/link";
import {
  CheckCircle,
  Package,
  Calendar,
  ShoppingCart,
  Home,
} from "lucide-react";

const OrderSuccessPage = ({ params }) => {
  const { orderId } = params;

  // Sample order details if not provided
  const sampleOrder = {
    orderId:
      orderId || "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    customerName: "John Doe",
    totalAmount: 199.99,
    items: [
      { name: "Premium Widget", quantity: 2, price: 79.99 },
      { name: "Deluxe Gadget", quantity: 1, price: 39.99 },
    ],
    orderDate: new Date().toLocaleDateString(),
    estimatedDelivery: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
  };

  // Use provided order details or fall back to sample
  const order = sampleOrder;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 transform transition-all hover:scale-[1.02]">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle
              size={64}
              className="text-white drop-shadow-md"
              strokeWidth={1.5}
            />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-white/80 mt-2">Thank you for your purchase</p>
        </div>

        {/* Order Details Content */}
        <div className="p-6 space-y-5">
          {/* Order Details Section */}
          <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-700">
              <Package
                size={20}
                className="mr-2 text-blue-600"
                strokeWidth={2}
              />
              Order Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <p className="text-sm text-gray-500">Order ID:</p>
              <p
                className="font-medium text-gray-800 truncate max-w-full"
                title={order.orderId}
              >
                {order.orderId}
              </p>

              <p className="text-sm text-gray-500">Order Date:</p>
              <p className="font-medium text-gray-800 flex items-center">
                <Calendar
                  size={16}
                  className="mr-2 text-gray-500"
                  strokeWidth={2}
                />
                {order.orderDate}
              </p>

              <p className="text-sm text-gray-500">Total Amount:</p>
              <p className="font-bold text-emerald-600 text-lg">
                ${order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Order Items
            </h3>
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between border-b border-gray-200 last:border-b-0 py-3 hover:bg-gray-100 rounded-lg px-2 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-700">
                  ${(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Delivery Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center shadow-sm">
            <p className="text-blue-700 flex items-center justify-center">
              <Calendar size={20} className="mr-2" strokeWidth={2} />
              Estimated Delivery: {order.estimatedDelivery}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <Link
              href="/orders"
              className="w-full py-3 px-4 border border-gray-300 rounded-lg text-center 
                         hover:bg-gray-100 transition-all flex items-center justify-center 
                         text-gray-700 hover:text-gray-900 hover:border-gray-400 shadow-sm"
            >
              <ShoppingCart size={16} className="mr-2" strokeWidth={2} />
              View Orders
            </Link>

            <Link
              href="/shops"
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-green-600 
                         text-white rounded-lg hover:from-emerald-700 hover:to-green-700 
                         transition-all text-center flex items-center justify-center 
                         shadow-md hover:shadow-lg"
            >
              <Home size={16} className="mr-2" strokeWidth={2} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
