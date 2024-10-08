import { Inter } from "next/font/google";
// import Header from "./componets/header";
// import Sidebar from "./componets/sidebar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "dashboard",
  description: "admin dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {/* <Header/> */}
        <div className="flex flex-1">
          {/* <Sidebar className="w-64" /> */}
          <main className="flex-1 bg-gray-100">{children}</main>
        </div>
      </body>
    </html>
  );
}