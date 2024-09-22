"use client";
import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Coins,
  ArrowRightLeft,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";

const Sidebar = () => {
  const [navVisible, setNavVisible] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const toggleNav = () => {
    setNavVisible(!navVisible);
  };

  const navItems = [
    { href: "/dashboards/business", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboards/business/products", icon: ShoppingBag, label: "Products" },
    { href: "/dashboards/business/customers", icon: Users, label: "Customers" },
    { href: "/dashboards/business/sales", icon: Coins, label: "Sales" },
    { href: "/dashboards/business/transactions", icon: ArrowRightLeft, label: "Transactions" },
    { href: "/dashboards/business/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 h-full z-30">
        <button
          onClick={toggleNav}
          className="md:hidden fixed top-20 right-4 z-50 p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
        >
          {navVisible ? <X size={24} /> : <Menu size={24} />}
        </button>

        <aside
          className={`flex flex-col w-64 h-screen bg-gray-800 text-gray-100 p-4 shadow-lg transform ${
            navVisible ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto`}
        >
          <div className="flex items-center justify-center mb-8 mt-4">
            <h2 className="text-lg font-bold">Business Dashboard</h2>
          </div>

          <nav className="flex-grow">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                      pathname === item.href
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto">
            {/* {session && (
              <div className="flex items-center mb-4 p-3 rounded-lg bg-gray-700">
                <div className="relative w-10 h-10 mr-3">
                  <img
                    src={session.user.image || "/images/profile/profile.jpg"}
                    className="rounded-full"
                    alt="Profile"
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <p className="font-medium">{session.user.name}</p>
                  <p className="text-sm text-gray-400">{session.user.email}</p>
                </div>
              </div>
            )} */}
            <button
              onClick={() => signOut()}
              className="w-full mb-2 flex items-center  p-3 bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
            >
              Logout 
             <ArrowRight className=" mx-2" />
            </button>
          </div>
        </aside>
      </div>
      <div className="md:ml-64">
        {/* Main content goes here */}
      </div>
    </>
  );
};

export default Sidebar;