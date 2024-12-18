"use client"
import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Package, 
  Truck, 
  CreditCard, 
  XCircle 
} from 'lucide-react';
import Footer from '@/components/footer';
import Header from '@/components/header';

// Mock notification data (you'd typically fetch this from an API)
const initialNotifications = [
  {
    id: 1,
    type: 'order',
    icon: Package,
    title: 'Order #12345 Shipped',
    description: 'Your order has been shipped and is on its way.',
    date: '2 hours ago',
    isRead: false,
    status: 'success'
  },
  {
    id: 2,
    type: 'payment',
    icon: CreditCard,
    title: 'Payment Successful',
    description: 'Payment for order #12344 has been processed.',
    date: 'Yesterday',
    isRead: true,
    status: 'success'
  },
  // {
  //   id: 3,
  //   type: 'stock',
  //   icon: AlertCircle,
  //   title: 'Low StockAlert',
  //   description: 'Some items in your wishlist are running low on stock.',
  //   date: '3 days ago',
  //   isRead: false,
  //   status: 'warning'
  // },
  // {
  //   id: 4,
  //   type: 'return',
  //   icon: XCircle,
  //   title: 'Return Request Rejected',
  //   description: 'Your return request for order #12340 was not approved.',
  //   date: '5 days ago',
  //   isRead: true,
  //   status: 'error'
  // }
];

const NotificationPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || notification.status === filter
  );

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  // Delete a specific notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Render notification icon based on status
  const NotificationIcon = ({ icon: Icon, status }) => {
    const statusColors = {
      success: 'text-green-500 bg-green-100',
      error: 'text-red-500 bg-red-100',
      warning: 'text-yellow-500 bg-yellow-100'
    };

    return (
      <div className={`p-3 rounded-full ${statusColors[status] || 'text-blue-500 bg-blue-100'}`}>
        <Icon className="w-6 h-6" />
      </div>
    );
  };

  return (
    <>
    <Header/>
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Bell className="w-8 h-8 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex space-x-2 mb-6 justify-start">
        {['all', 'success', 'error', 'warning'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm capitalize 
              ${filter === status 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>No notifications to show</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div 
              key={notification.id}
              className={`flex items-center space-x-4 p-4 rounded-lg 
                ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-500'}
                hover:bg-gray-100 transition-colors`}
            >
              <NotificationIcon 
                icon={notification.icon} 
                status={notification.status} 
              />
              <div className="flex-grow">
                <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                <p className="text-gray-600 text-sm">{notification.description}</p>
                <span className="text-xs text-gray-500">{notification.date}</span>
              </div>
              <button 
                onClick={() => deleteNotification(notification.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Delete notification"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
<Footer/>
    </>
  );
};

export default NotificationPage;