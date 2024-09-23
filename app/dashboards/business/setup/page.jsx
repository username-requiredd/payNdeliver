"use client";
import React, { useState } from "react";
import { Camera } from "lucide-react";
import { useSession } from "next-auth/react"; // Import useSession to get session info


const ProfileSetupPage = ()=>{
  const { data: session } = useSession(); // Extract session data
  const [coverImage, setCoverImage] = useState(null);
  const [address, setAddress] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [description, setDescription] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCoverImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!session || !session.user) {
      console.error("No session found.");
      return;
    }

    const businessId = session?.user?.id; // Extract business ID from session (adjust this based on your session structure)
  
    const updatedData = {
      coverImage, // Assuming coverImage is in base64 format or can be processed on the server
      address,
      openingHours,
      description,
    };

    try {
      const response = await fetch(`/api/business/${businessId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await response.json();
      console.log("Profile updated successfully:", result);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Complete Your Profile Setup
          </h2>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="mx-auto h-48 w-full object-cover rounded-md"
                  />
                ) : (
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="opening-hours"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Opening Hours
            </label>
            <textarea
              id="opening-hours"
              name="opening-hours"
              rows="3"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              placeholder="e.g. Mon-Fri: 9AM-5PM, Sat: 10AM-3PM, Sun: Closed"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              placeholder="Brief description of your business"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={handleSaveProfile}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetupPage