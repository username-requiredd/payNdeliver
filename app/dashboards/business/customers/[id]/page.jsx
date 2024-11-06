// import React from 'react';

import InvoiceTable from "./invoice";

const ProfileCard = ({ params }) => {
  const { id } = params;
  // console.log(id)
  return (
    <div className=" mt-5">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-4 px-4">
          {/* Profile Section */}
          <div className="col-span-4 sm:col-span-3">
            <div className="bg-white shadow-lg rounded-xl p-8">
              <div className="flex flex-col items-center">
                <img
                  src="https://randomuser.me/api/portraits/men/94.jpg"
                  alt="John Doe"
                  className="w-32 h-32 bg-gray-300 rounded-full mb-4 shadow-md"
                />
                <h1 className="text-2xl font-semibold text-gray-900">Akila</h1>
                <p className="text-gray-600 text-sm">
                  Email:{" "}
                  <span className="font-medium text-gray-800">
                    akila@gmail.com
                  </span>
                </p>
                <p className="text-gray-600 text-sm">
                  Phone:{" "}
                  <span className="font-medium text-gray-800">
                    901-120-2377
                  </span>
                </p>
                <p className="text-gray-600 text-sm text-center">
                  Address:{" "}
                  <span className="font-medium text-gray-800">
                    123 Main Street, Lagos, Nigeria
                  </span>
                </p>
              </div>
              <hr className="my-6 border-t border-gray-200" />
            </div>
          </div>

          {/* About and Experience Section */}
          <div className="col-span-4 sm:col-span-9">
            <div className="bg-white shadow rounded-lg p-6">
              <InvoiceTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
