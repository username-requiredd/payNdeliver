import React from "react";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-green-400 to-green-600">
      <div className="relative">
        <div className="w-24 h-24 border-t-4 border-b-4 border-white rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-b-4 border-green-200 rounded-full animate-ping"></div>
      </div>
      {/* <p className="ml-4 text-2xl font-bold text-white">Loading...</p> */}
    </div>
  );
};

export default PageLoader;
