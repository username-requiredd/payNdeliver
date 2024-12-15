"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import OrderDetailsModal from "./orderdetails";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Truck,
  Heart,
  CreditCard,
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const AccountPage = () => {
  const dummyProductOrderData = {
    productId: "64D5E6F7G8H9",
    productName: "Wireless Noise-Cancelling Headphones",
    productImage: "/api/placeholder/300/300",
    quantity: 3,
    unitPriceUSD: 49.99,
    subtotalUSD: 149.97,
    orderId: "67C9F1E2D3B4",
    customerId: "65B8E0F4D1C2",
    businessId: "67A9B1C2D3E4",
    payment: {
      type: "credit_card",
      transactionHash:
        "3NYECGDH3y3fMh4BFe73SnWE1yhwNVkjLejeVUT7ZMoGioyqWrv4MpzWKGmPoWEV3DUQzDT2J1W4G7vmnH5hrfoN",
    },
    createdAt: "2024-07-15T14:30:45.123Z",
  };

  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role === "admin") {
      router.push("/dashboards/admin");
    }
  }, [session, router]);

  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Truck },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 pt-5 px-4 sm:px-6 lg:px-8">
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
            <div className="p-6">
              {isOpen && (
                <OrderDetailsModal
                  productOrder={dummyProductOrderData}
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                />
              )}
              {activeTab === "profile" && <ProfileSection session={session} />}
              {activeTab === "orders" && (
                <OrdersSection session={session} setIsOpen={setIsOpen} />
              )}
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
    name: session?.user?.name || "Unknown User",
    email: session?.user?.email || "N/A",
    phone: "N/A",
    address: "N/A",
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
      <div className="lg:flex sm:block items-center justify-around">
        <InfoItem
          icon={User}
          label="Name"
          value={user.name}
          className="sm:p-4"
        />
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

const OrdersSection = ({ session, setIsOpen }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/orders/${session.user.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [session?.user?.id]);

  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <p>Loading orders...</p>
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
      <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
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
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Status: {order.payment.status}
              </div>
              <div className="mt-2">
                <button
                  onClick={() => setIsOpen(true)}
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
