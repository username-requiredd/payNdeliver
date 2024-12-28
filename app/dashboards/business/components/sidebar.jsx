"use client";
import React, { useState, useEffect } from "react";
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
  LogIn,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { href: "/dashboards/business", icon: LayoutDashboard, label: "Dashboard" },
    {
      href: "/dashboards/business/products",
      icon: ShoppingBag,
      label: "Products",
    },
    {
      href: "/dashboards/business/transactions",
      icon: ArrowRightLeft,
      label: "Orders",
    },
    { href: "/dashboards/business/sales", icon: Coins, label: "Sales" },

    { href: "/dashboards/business/customers", icon: Users, label: "Customers" },
  ];

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleNav}
          className="fixed top-20 right-4 z-50 p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-40 w-64 bg-gray-800 text-gray-100 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out overflow-hidden flex flex-col`}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-center mb-8 mt-4">
            <h2 className="text-lg font-bold">Business Dashboard</h2>
          </div>

          <nav className="flex-grow overflow-y-auto">
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
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto pt-4">
            {session?.user?.id ? (
              <button
                onClick={() => signOut()}
                className="w-full rounded-md flex items-center text-start p-3 px-3 bg-gray-700 text-white hover:bg-red-600 transition-colors duration-200"
              >
                Logout
                <LogOut className="ml-2" />
              </button>
            ) : (
              <Link
                href={"/signin"}
                className="w-full rounded-md flex items-center text-start p-3 px-3 bg-gray-700 text-white hover:bg-green-600 transition-colors duration-200"
              >
                Login
                <LogIn className="ml-2" />
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
