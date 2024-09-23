"use client";

import React, { useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/Imageupload";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileSetupPage = () => {
  const { data: session } = useSession();
  const [coverImage, setCoverImage] = useState(null);
  const [address, setAddress] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleImageUpload = (url) => {
    setCoverImage(url);
  };

  const handleSaveProfile = async () => {
    if (!session?.user) {
      console.error("No session found.");
      return;
    }

    const businessId = session.user.id;

    const updatedData = {
      coverImage, // Use coverImage field
      address,
      openingHours,
      description,
    };

    try {
      setLoading(true);
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
      setLoading(false);
      console.log("Profile updated successfully:", result);

      // Show success toast notification
      toast.success("Account setup completed successfully! Redirecting...", {
        position: "top-right",
        autoClose: 3000,
      });

      // Redirect to the products/add route after successful profile update
      setTimeout(() => {
        router.push("products/add");
      }, 2000); // Delay redirect to let user see the success message
    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.error("Error updating profile:", error);

      // Show error toast notification
      toast.error("Error updating profile: " + error.message, {
        position: "top-right",
        autoClose: 3000,
      });
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
                  <ImageUpload onImageUpload={handleImageUpload} />
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
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
              rows="3"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              placeholder="Brief description of your business"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="mt-8">
            <button
              disabled={loading}
              type="button"
              onClick={handleSaveProfile}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Toast container to display toasts */}
      <ToastContainer />
    </div>
  );
};

export default ProfileSetupPage;
