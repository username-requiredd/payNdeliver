"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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
  // console.log(session);
  const router = useRouter();
  if (session?.user?.role === "business") {
    router.push("/dashboards/business");
  }
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
              {activeTab === "profile" && <ProfileSection />}
              {activeTab === "orders" && <OrdersSection />}
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

const ProfileSection = () => {
  const { data: session } = useSession();
  // console.log(session);
  // Mock user data
  const user = {
    email: session?.user?.email,
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, ST 12345",
    memberSince: "January 2022",
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

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center">
    <Icon className="w-5 h-5 text-gray-400 mr-3" />
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  </div>
);

const OrdersSection = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
    <div className="space-y-4">
      {[1, 2, 3].map((order) => (
        <div key={order} className="border border-gray-200 rounded-md p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Order #{order}</span>
            <span className="text-sm text-gray-500">Date: 2023-09-{order}</span>
          </div>
          <div className="text-sm text-gray-600">Status: Shipped</div>
          <div className="mt-2">
            <a href="#" className="text-indigo-600 hover:text-indigo-800">
              View Details
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
);

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
          <div className="font-medium">Visa ending in 1234</div>
          <div className="text-sm text-gray-500">Expires 12/2025</div>
        </div>
      </div>
      <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Add New Payment Method
      </button>
    </div>
  </div>
);

export default AccountPage;
