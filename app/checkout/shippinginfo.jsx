"use client";
import React from "react";

const ShippingForm = ({ shippingInfo, onInfoChange }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-gray-700 font-medium"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={shippingInfo.name}
            onChange={(e) => onInfoChange("name", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-gray-700 font-medium"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={shippingInfo.email}
            onChange={(e) => onInfoChange("email", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="address"
            className="block mb-2 text-gray-700 font-medium"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            value={shippingInfo.address}
            onChange={(e) => onInfoChange("address", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="city"
            className="block mb-2 text-gray-700 font-medium"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            value={shippingInfo.city}
            onChange={(e) => onInfoChange("city", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="state"
            className="block mb-2 text-gray-700 font-medium"
          >
            State
          </label>
          <input
            type="text"
            id="state"
            value={shippingInfo.state}
            onChange={(e) => onInfoChange("state", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="zip" className="block mb-2 text-gray-700 font-medium">
            Zip Code
          </label>
          <input
            type="text"
            id="zip"
            value={shippingInfo.zip}
            onChange={(e) => onInfoChange("zip", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block mb-2 text-gray-700 font-medium"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            value={shippingInfo.phone}
            onChange={(e) => onInfoChange("phone", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
