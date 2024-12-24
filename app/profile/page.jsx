"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import OrderDetailsModal from "./orderdetails";
import { User, Mail, Phone, MapPin, Truck } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const AccountPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!session) return; // Wait for session data

    if (session.user.role === "admin") {
      router.push("/dashboards/admin");
    } else if (session.user.role === "business") {
      router.push("/dashboards/business");
    }
  }, [session, router]);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Truck },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-1 text-center text-sm font-medium ${
                    activeTab === tab.id
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon className="w-5 h-5 mx-auto mb-1" />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-6 my-5">
              {activeTab === "profile" && <ProfileSection session={session} />}
              {activeTab === "orders" && <OrdersSection />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const ProfileSection = ({ session }) => {
  const user = {
    name: session?.user?.name || "N/A",
    email: session?.user?.email || "N/A",
    phone: session?.user?.phone || "N/A",
    address: session?.user?.address || "N/A",
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
      <div className="lg:flex sm:block items-center justify-around">
        <InfoItem
          icon={Mail}
          label="Email"
          value={user.email}
          className="sm:p-4"
        />
        <InfoItem
          icon={Phone}
          label="Phone"
          value={user.phone}
          className="sm:p-4"
        />
        <InfoItem
          icon={MapPin}
          label="Address"
          value={user.address}
          className="sm:p-4"
        />
      </div>
      <div className="mt-6">
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

const OrdersSection = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/orders/${session.user.id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch orders. Status: ${response.status}`);
      }

      const data = await response.json();
      setOrders(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while fetching orders"
      );
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewOrder = (id) => {
    setOrderId(id);
    setIsOpen(true);
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <p className="animate-pulse text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {isOpen && (
        <OrderDetailsModal
          id={orderId}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
      <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-md p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">
                  Order #{order._id.slice(-6)}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Status: awaiting delivery
              </div>
              <div className="mt-2">
                <button
                  onClick={() => handleViewOrder(order._id)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value, className }) => (
  <div className={`flex items-center mb-4 ${className}`}>
    <Icon className="w-5 h-5 text-gray-400 mr-3" />
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-gray-500">{value}</div>
    </div>
  </div>
);

export default AccountPage;
