"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useCart } from "@/contex/cartcontex";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { cart } = useCart();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="shadow-sm bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex-shrink-0">
            <h3 className="text-3xl font-bold text-black italic">
              PayNDeliver
            </h3>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/" active={pathname === "/"}>
              Home
            </NavLink>
            <NavLink href="/stores" active={pathname === "/stores"}>
              Stores
            </NavLink>
            <NavLink href="/about" active={pathname === "/about"}>
              About
            </NavLink>
            <NavLink href="/contact" active={pathname === "/contact"}>
              Contact
            </NavLink>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="/cart"
              className="relative text-gray-600 hover:text-indigo-600 transition-colors duration-200"
            >
              <ShoppingBag className="h-6 w-6" />
              {mounted && cart.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>

            <Link
              href="/profile"
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
            >
              <User className="h-6 w-6" />
            </Link>

            <button
              className="text-gray-600 hover:text-indigo-600 focus:outline-none md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink href="/" active={pathname === "/"}>
              Home
            </MobileNavLink>
            <MobileNavLink href="/stores" active={pathname === "/stores"}>
              Stores
            </MobileNavLink>
            <MobileNavLink href="/about" active={pathname === "/about"}>
              About
            </MobileNavLink>
            <MobileNavLink href="/contact" active={pathname === "/contact"}>
              Contact
            </MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ href, active, children }) => (
  <Link
    href={href}
    className={`font-medium transition-colors duration-200 relative ${
      active ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
    }`}
  >
    {children}
    {active && (
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
    )}
  </Link>
);

const MobileNavLink = ({ href, active, children }) => (
  <Link
    href={href}
    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
      active
        ? "bg-indigo-100 text-indigo-600"
        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
    }`}
  >
    {children}
  </Link>
);

export default Header;
