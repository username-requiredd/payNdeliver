import { Inter } from "next/font/google";
import Header from "./components/header";
import Sidebar from "./components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "dashboard",
  description: "admin dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 bg-gray-100 p-4 transition-all duration-300 ease-in-out md:ml-64">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}