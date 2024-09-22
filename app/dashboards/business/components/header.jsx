"use client";
import { Search, Bell, User } from "lucide-react";
import { useSession } from "next-auth/react";
const Header = () => {
    const {data:session} = useSession()
    console.log(session)
  return (
    <>
      <header className="fixed z-50 top-0 left-0 right-0 bg-white shadow-sm ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <p className="font-semibold">{session?.user?.businessName} Admin</p>
          {/* <h1 className="text-2xl font-bold text-gray-900">Admin</h1> */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search records..."
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <Bell className="h-6 w-6" />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <User className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
      <div className="h-16"></div> {/* Spacer to prevent content from going under the fixed header */}
    </>
  );
};

export default Header;