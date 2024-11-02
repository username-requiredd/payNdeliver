import React from "react";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 backdrop-blur-sm z-50">
      <div className="text-center">
        <div className="relative w-24 h-24 mb-4 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-400  rounded-full animate-ping opacity-75"></div>
          <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-teal-600 rounded-full animate-pulse">
            <svg
              className="w-12 h-12 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
        {/* <h2 className="text-xl font-semibold text-white mb-2">Loading</h2>
        <p className="text-gray-300 animate-pulse">Please wait...</p> */}
      </div>
    </div>
  );
};

export default PageLoader;
