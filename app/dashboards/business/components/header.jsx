"use client";
import { Search, Bell, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isLinkActive = (href) => {
    return pathname === href;
  };

  return (
    <>
      <header className="fixed z-50 top-0 left-0 right-0 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <p className="font-semibold">{session?.user?.businessName} Admin</p>
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboards/business/notifications"
              className={`relative p-2 rounded-full transition-colors duration-200 ${
                isLinkActive("/dashboards/business/notifications")
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Bell className="h-6 w-6" />
              {isLinkActive("/dashboards/business/notifications") && (
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-indigo-600" />
              )}
            </Link>
            <Link
              href="/dashboards/business/profile"
              className={`relative p-2 rounded-full transition-colors duration-200 ${
                isLinkActive("/dashboards/business/profile")
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <User className="h-6 w-6" />
              {isLinkActive("/dashboards/business/profile") && (
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-indigo-600" />
              )}
            </Link>
          </div>
        </div>
      </header>
      <div className="h-16"></div>{" "}
      {/* Spacer to prevent content from going under the fixed header */}
    </>
  );
};

export default Header;
