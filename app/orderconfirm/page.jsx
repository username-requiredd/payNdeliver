import React from 'react';
import Link from 'next/link';

const OrderSuccessPage = ({ orderDetails }) => {
  // Sample order details if not provided
  const sampleOrder = {
    orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    customerName: 'John Doe',
    totalAmount: 199.99,
    items: [
      { name: 'Premium Widget', quantity: 2, price: 79.99 },
      { name: 'Deluxe Gadget', quantity: 1, price: 39.99 }
    ],
    orderDate: new Date().toLocaleDateString(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
  };

  // Use provided order details or fall back to sample
  const order = orderDetails || sampleOrder;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-green-50 p-6 text-center">
          <div className="flex justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-green-600"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-700">
            Order Confirmed!
          </h1>
        </div>
        
        {/* Order Details Content */}
        <div className="p-6 space-y-4">
          {/* Order Details Section */}
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="mr-2 text-blue-600"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              </svg>
              Order Details
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-sm text-gray-600">Order ID:</p>
              <p className="font-medium">{order.orderId}</p>
              
              <p className="text-sm text-gray-600">Order Date:</p>
              <p className="font-medium">{order.orderDate}</p>
              
              <p className="text-sm text-gray-600">Total Amount:</p>
              <p className="font-medium text-green-600">${order.totalAmount.toFixed(2)}</p>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Order Items</h3>
            {order.items.map((item, index) => (
              <div 
                key={index} 
                className="flex justify-between border-b border-gray-200 last:border-b-0 py-2"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Delivery Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-700">
              Estimated Delivery: {order.estimatedDelivery}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <Link 
              href="/orders" 
              className="w-full py-2 px-4 border border-gray-300 rounded-md text-center 
                         hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="mr-2"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              View Orders
            </Link>
            
            <Link 
              href="/" 
              className="w-full py-2 px-4 bg-green-600 text-white rounded-md 
                         hover:bg-green-700 transition-colors text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;