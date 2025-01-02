import React from "react";

const BusinessDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Cover Image Skeleton */}
        <div className="h-48 bg-gray-200" />

        {/* Business Details Skeleton */}
        <div className="p-6">
          {/* Title and Type */}
          <div className="h-8 bg-gray-200 rounded-md w-2/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded-md w-1/3 mb-6" />

          {/* Contact Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-6 h-6 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                </div>
              </div>
            ))}
          </div>

          {/* Bank Details Skeleton */}
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-4" />
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 mb-4">
                <div className="w-6 h-6 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded-md w-2/3" />
                </div>
              </div>
            ))}
          </div>

          {/* Opening Hours Skeleton */}
          <div className="mb-8">
            <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-4" />
            {[...Array(7)].map((_, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-2"
              >
                <div className="h-4 bg-gray-200 rounded-md w-20" />
                <div className="h-4 bg-gray-200 rounded-md w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Skeleton */}
      <div className="max-w-4xl mx-auto mt-8">
        <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4">
              <div className="h-48 bg-gray-200 rounded-md mb-4" />
              <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded-md w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsSkeleton;
