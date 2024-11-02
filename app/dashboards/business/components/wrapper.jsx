"use client";
import React, { useState, useEffect } from "react";

const MainContentWrapper = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <main
      className={`flex-1 bg-gray-100 p-4 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "md:ml-64" : "ml-0"
      }`}
    >
      {children}
    </main>
  );
};

export default MainContentWrapper;
