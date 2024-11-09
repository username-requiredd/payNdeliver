"use client";
import React from "react";
import {
  AlertTriangle,
  Home,
  RefreshCcw,
  Wifi,
  Database,
  FileX,
} from "lucide-react";
import Link from "next/link";

const CustomError = ({
  statusCode = 500,
  title = "Something went wrong",
  message = "We're experiencing technical difficulties. Please try again later.",
}) => {
  const getErrorContent = () => {
    switch (statusCode) {
      case 404:
        return {
          icon: (
            <svg
              className="w-48 h-48"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="100"
                cy="100"
                r="96"
                stroke="#E5E7EB"
                strokeWidth="8"
              />
              <path
                d="M65 80C65 80 80 65 100 65C120 65 135 80 135 80"
                stroke="#374151"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <circle cx="60" cy="60" r="8" fill="#374151" />
              <circle cx="140" cy="60" r="8" fill="#374151" />
              <path
                d="M65 140C65 140 80 125 100 125C120 125 135 140 135 140"
                stroke="#374151"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>
          ),
          color: "indigo",
        };
      case 500:
        return {
          icon: <Database size={96} className="text-red-500 animate-bounce" />,
          color: "red",
        };
      case 503:
        return {
          icon: <Wifi size={96} className="text-yellow-500 animate-pulse" />,
          color: "yellow",
        };
      default:
        return {
          icon: (
            <AlertTriangle
              size={96}
              className="text-orange-500 animate-pulse"
            />
          ),
          color: "orange",
        };
    }
  };

  const errorContent = getErrorContent();
  const buttonBaseClass = `inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2`;
  const buttonColorClass = `bg-${errorContent.color}-600 hover:bg-${errorContent.color}-700 focus:ring-${errorContent.color}-500`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent animate-pulse" />
            <div className="relative flex justify-center mb-8">
              {errorContent.icon}
            </div>
          </div>

          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-6xl font-bold text-gray-900 animate-fade-in">
                {statusCode}
              </h1>
              <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
              <p className="text-gray-600 mt-2">{message}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => window.location.reload()}
                className={`${buttonBaseClass} ${buttonColorClass} transform hover:-translate-y-1`}
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Try Again
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500">Error Code: {statusCode}</p>
          <p className="text-sm text-gray-500">
            If the problem persists, please contact our support team
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CustomError;
