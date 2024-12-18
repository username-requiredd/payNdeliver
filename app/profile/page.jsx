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
  // const dummyOrderData = {
  //   _id: {
  //     $oid: "65AB7C23D456E89F12345678",
  //   },
  //   customerId: {
  //     $oid: "65AB7C23D456E89F87654321",
  //   },
  //   businessId: {
  //     $oid: "65AB7C23D456E89F24681357",
  //   },
  //   product: {
  //     productId: {
  //       $oid: "65AB7C23D456E89F13579246",
  //     },
  //     name: "Premium Wireless Noise-Canceling Headphones",
  //     description:
  //       "Advanced noise-canceling technology with 40-hour battery life and premium sound quality",
  //     quantity: 1,
  //     unitPriceUSD: 34900,
  //     subtotalUSD: 34900,
  //     productImage: "/api/placeholder/400/400?text=Headphones",
  //     _id: {
  //       $oid: "65AB7C23D456E89F98765432",
  //     },
  //   },
  //   totalAmountUSD: 39900,
  //   payment: {
  //     type: "credit_card",
  //     cardLastFour: "4321",
  //     transactionHash: "0x1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T",
  //   },
  //   delivery: {
  //     name: "Emily Rodriguez",
  //     email: "emily.rodriguez@example.com",
  //     address: "456 Innovation Street",
  //     city: "San Francisco",
  //     state: "California",
  //     zip: "94105",
  //     phone: "415-555-7890",
  //   },
  //   shipping: {
  //     method: "Express Delivery",
  //     trackingNumber: "1Z999AA1012345678",
  //     estimatedDelivery: "2024-01-20",
  //   },
  //   createdAt: {
  //     $date: "2024-01-15T14:30:22.317Z",
  //   },
  //   updatedAt: {
  //     $date: "2024-01-15T14:30:22.617Z",
  //   },
  //   __v: 0,
  // };

  const { data: session } = useSession();
  const router = useRouter();
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
      <div className="min-h-screen bg-gray-100  py-5  px-4 sm:px-6 lg:px-8">
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
                <OrdersSection
                  session={session}
                  setIsOpen={setIsOpen}
                  setOrderId={setOrderId}  // Pass setOrderId to OrdersSection
                />
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
        {/* <InfoItem
          icon={User}
          label="Name"
          value={user.name}
          className="sm:p-4"
        /> */}
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
  const [orderId, setOrderID] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleViewOrder = (id) => {
    console.log("order id", id);
    setOrderID(id);

    setIsOpen(true);
  };

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
      {isOpen && (
        <OrderDetailsModal
          id={orderId}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
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
                Status: awaiting delivery
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
