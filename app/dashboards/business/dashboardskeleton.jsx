import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="mt-5 p-2 grid gap-3 grid-cols-1 md:grid-cols-3">
      {/* Stat Cards Skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-full bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="mt-4 h-8 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}

      {/* Chart Skeleton */}
      <div className="col-span-1 md:col-span-3">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="w-full h-[400px] bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Dashboard Component Skeleton */}
      <div className="col-span-1 md:col-span-3">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {/* Table Header Skeleton */}
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Table Rows Skeleton */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 py-3 border-b">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
