import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header skeleton */}
          <div className="relative h-48 bg-gray-200 animate-pulse">
            <div className="absolute bottom-4 left-6">
              <div className="h-8 w-48 bg-gray-300 rounded-md"></div>
            </div>
          </div>

          <div className="px-6 py-8">
            {/* Input fields grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-100 rounded-md animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Opening hours skeleton */}
            <div className="mt-8">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                  <div
                    key={item}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-md"
                  >
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description skeleton */}
            <div className="mt-8">
              <div className="h-4 w-36 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-32 bg-gray-100 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
