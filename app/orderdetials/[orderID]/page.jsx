import React from 'react';
import { Home, Package, CreditCard, Truck, CheckCircle } from 'lucide-react';

const OrderDetailsPage = ({params}) => {
    const {id} = params;
    console.log(id)
  // Sample order data (you would replace this with actual order data)
  const orderData = {
    orderNumber: '#12345',
    date: 'May 15, 2024',
    status: 'Shipped',
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567'
    },
    shipping: {
      method: 'Express Delivery',
      address: '123 Main St, Anytown, USA 12345'
    },
    items: [
      {
        id: 1,
        name: 'Vintage Leather Jacket',
        price: 249.99,
        quantity: 1,
        image: '/api/placeholder/200/200'
      },
      {
        id: 2,
        name: 'Classic White Sneakers',
        price: 129.99,
        quantity: 2,
        image: '/api/placeholder/200/200'
      }
    ],
    totals: {
      subtotal: 509.97,
      shipping: 15.00,
      tax: 40.80,
      total: 565.77
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
          <p className="text-gray-500">Order {orderData.orderNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-600">Order Date: {orderData.date}</p>
          <div className="flex items-center justify-end space-x-2 mt-2">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              {orderData.status}
            </span>
          </div>
        </div>
      </div>

      {/* Order Tracking */}
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Home className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-semibold text-gray-800">Order Placed</p>
              <p className="text-gray-500 text-sm">{orderData.date}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Package className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-semibold text-gray-800">Processing</p>
              <p className="text-gray-500 text-sm">May 16, 2024</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Truck className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-semibold text-gray-800">Shipped</p>
              <p className="text-gray-500 text-sm">May 17, 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Items</h2>
        {orderData.items.map((item) => (
          <div key={item.id} className="flex items-center border-b py-4">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-24 h-24 object-cover rounded-lg mr-6" 
            />
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-800">${item.price.toFixed(2)}</p>
              <p className="text-gray-600">Total: ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between mb-2">
          <p className="text-gray-600">Subtotal</p>
          <p className="font-semibold">${orderData.totals.subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-gray-600">Shipping</p>
          <p className="font-semibold">${orderData.totals.shipping.toFixed(2)}</p>
        </div>
        <div className="flex justify-between mb-4">
          <p className="text-gray-600">Tax</p>
          <p className="font-semibold">${orderData.totals.tax.toFixed(2)}</p>
        </div>
        <div className="flex justify-between border-t pt-4">
          <p className="text-xl font-bold text-gray-800">Total</p>
          <p className="text-xl font-bold text-gray-800">${orderData.totals.total.toFixed(2)}</p>
        </div>
      </div>

      {/* Customer & Shipping Information */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Information</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold text-gray-800">{orderData.customer.name}</p>
            <p className="text-gray-600">{orderData.customer.email}</p>
            <p className="text-gray-600">{orderData.customer.phone}</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shipping Information</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold text-gray-800">{orderData.shipping.method}</p>
            <p className="text-gray-600">{orderData.shipping.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;