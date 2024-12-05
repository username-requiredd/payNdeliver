"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  const { data: session } = useSession();
  const router = useRouter();

  if (session?.user?.role === "admin") {
    router.push("/dashboards/admin");
  }

  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Truck },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
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
              {activeTab === "profile" && <ProfileSection session={session} />}
              {activeTab === "orders" && <OrdersSection session={session} />}
              {activeTab === "wishlist" && <WishlistSection />}
              {activeTab === "payment" && <PaymentSection />}
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
    // name: session?.user?.name || "Unknown User",
    email: session?.user?.email,
    phone: "N/A",
    address: "N/A",
    // memberSince: "January 2022",
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
      <div className="lg:flex sm:block items-center justify-around">
        <InfoItem icon={User} label="Name" value={user.name} className="sm:p-4" />
        <InfoItem icon={Mail} label="Email" value={user.email} className="sm:p-4" />
        <InfoItem icon={Phone} label="Phone" value={user.phone} className="sm:p-4" />
        <InfoItem icon={MapPin} label="Address" value={user.address} className="sm:p-4" />
        <InfoItem
          icon={User}
          label="Member Since"
          value={user.memberSince}
          className="sm:p-4"
        />
      </div>
      <div className="mt-6">
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

const OrdersSection = ({ session }) => {
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
        console.log("order data:",data)
        setOrders(data.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
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
                <span className="font-medium">Order #{order._id.slice(-6)}</span>
                <span className="text-sm text-gray-500">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Status: {order.payment.status}
              </div>
              <div className="mt-2">
                <button
                  onClick={() => {
                    /* Implement order details modal/page */
                  }}
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

const WishlistSection = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">My Wishlist</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="border border-gray-200 rounded-md p-4 flex items-center"
        >
          <div className="flex-shrink-0 h-16 w-16 bg-gray-300 rounded-md mr-4"></div>
          <div>
            <h3 className="text-sm font-medium">Product Name {item}</h3>
            <p className="text-sm text-gray-500">$99.99</p>
            <button className="mt-2 text-xs text-indigo-600 hover:text-indigo-800">
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PaymentSection = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-md p-4 flex items-center">
        <CreditCard className="w-8 h-8 text-gray-400 mr-3" />
        <div>
          <div class
          ="font-medium text-sm">Visa ending in 1234</div>
          <div className="text-xs text-gray-500">Expires 12/24</div>
          <button className="mt-2 text-xs text-red-600 hover:text-red-800">
            Remove
          </button>
        </div>
      </div>
      <div className="border border-gray-200 rounded-md p-4 flex items-center">
        <CreditCard className="w-8 h-8 text-gray-400 mr-3" />
        <div>
          <div className="font-medium text-sm">MasterCard ending in 5678</div>
          <div className="text-xs text-gray-500">Expires 08/25</div>
          <button className="mt-2 text-xs text-red-600 hover:text-red-800">
            Remove
          </button>
        </div>
      </div>
      <div className="mt-4">
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          Add New Payment Method
        </button>
      </div>
    </div>
  </div>
);

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
