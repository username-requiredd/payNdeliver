"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  User, 
  LogOut, 
  Settings, 
  Bell,
  ChevronDown 
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useCart } from "@/contex/cartcontex";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { cart } = useCart();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
    
    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      const menuElement = document.getElementById('user-menu-container');
      if (menuElement && !menuElement.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="flex items-center justify-between h-16">
  {/* Logo */}
  <Link 
    href="/" 
    className="flex-shrink-0 flex items-center space-x-2 group"
  >
    <img
      src="/images/logo/payNdeliver.svg"
      className="h-auto w-24 md:w-20 lg:w-24 transition-transform group-hover:scale-105"
      alt="Logo"
    />
  </Link>

  {/* Navigation Actions */}
  <div className="flex items-center space-x-4">
    {/* Notifications (Optional) */}
    <Link href={"/notification"} className="relative text-gray-500 hover:text-emerald-600 transition-colors">
      <Bell className="h-5 w-5" />
      {mounted && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center 
          h-4 w-4 text-xs font-bold text-white bg-red-500 rounded-full">
          0
        </span>
      )}
    </Link>

    {/* Shopping Cart */}
    <Link
      href="/cart"
      className="relative text-gray-500 hover:text-emerald-600 transition-colors group"
    >
      <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
      {mounted && cart.length > 0 && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 inline-flex items-center justify-center 
            h-4 w-4 text-xs font-bold text-white bg-emerald-500 rounded-full"
        >
          {cart.length}
        </motion.span>
      )}
    </Link>

    {/* User Menu */}
    <div 
      id="user-menu-container"
      className="relative"
    >
      <button
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className="flex items-center text-gray-500 hover:text-emerald-600 
          focus:outline-none transition-colors group"
      >
        <div className="flex items-center space-x-1">
          {session?.user?.image ? (
            <img 
              src={session.user.image} 
              alt="Profile" 
              className="h-8 w-8 rounded-full border-2 border-emerald-500 group-hover:border-emerald-600"
            />
          ) : (
            <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
          )}
          <ChevronDown 
            className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 
              transition-transform group-hover:rotate-180"
          />
        </div>
      </button>

      <AnimatePresence>
        {userMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 rounded-xl 
              bg-white shadow-lg ring-1 ring-black/5 
              divide-y divide-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session?.user?.name || 'Guest'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session?.user?.email || 'Not logged in'}
              </p>
            </div>
            
            <div className="py-1">
              <UserMenuItem 
                href="/profile" 
                icon={<User className="h-4 w-4" />} 
                label="Profile" 
              />
              <UserMenuItem 
                href="/settings" 
                icon={<Settings className="h-4 w-4" />} 
                label="Settings" 
              />
            </div>
            
            <div className="py-1">
              <button
                onClick={() => signOut()}
                className="flex w-full items-center px-4 py-2 text-sm 
                  text-red-600 hover:bg-red-50 space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
</div>
      </div>
    </header>
  );
};

const UserMenuItem = ({ href, icon, label }) => (
  <Link
    href={href}
    className="flex items-center px-4 py-2 text-sm text-gray-700 
      hover:bg-gray-100 space-x-2 group"
  >
    {icon}
    <span className="group-hover:text-emerald-600 transition-colors">
      {label}
    </span>
  </Link>
);

export default Header;