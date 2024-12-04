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
  const router = useRouter();

  const [formData, setFormData] = useState({
    image: null,
    coverImage: null,
    address: "",
    walletAddress: "",
    accountNumber: "",
    accountName:"",
    description: "",
    openingHours: [
      { day: "Monday", openingTime: "", closingTime: "" },
      { day: "Tuesday", openingTime: "", closingTime: "" },
      { day: "Wednesday", openingTime: "", closingTime: "" },
      { day: "Thursday", openingTime: "", closingTime: "" },
      { day: "Friday", openingTime: "", closingTime: "" },
      { day: "Saturday", openingTime: "", closingTime: "" },
      { day: "Sunday", openingTime: "", closingTime: "" },
    ],
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = (url) => {
    setFormData((prevData) => ({ ...prevData, image: url, coverImage: url }));
  };

  const handleOpeningHoursChange = (index, field, value) => {
    const newOpeningHours = [...formData.openingHours];
    newOpeningHours[index][field] = value;
    setFormData((prevData) => ({ ...prevData, openingHours: newOpeningHours }));
  };

  const handleSaveProfile = async () => {
    if (!session?.user) {
      console.error("No session found.");
      return;
    }

    const businessId = session.user.id;

    try {
      setLoading(true);
      const response = await fetch(`/api/business/${businessId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await response.json();
      // console.log("Profile updated successfully:", result);

      toast.success("Account setup completed successfully! Redirecting...", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        router.push("products/add");
      }, 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile: " + error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
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
                {formData.coverImage ? (
                  <img
                    src={formData.coverImage}
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

          {["address", "walletAddress", "accountNumber","accountName"].map((field) => (
            <div key={field} className="mb-6">
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {field.charAt(0).toUpperCase() +
                  field
                    .slice(1)
                    .replace(/([A-Z])/g, " $1")
                    .trim()}
              </label>
              <input
                type="text"
                id={field}
                name={field}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                placeholder={`Enter your ${field
                  .replace(/([A-Z])/g, " $1")
                  .toLowerCase()
                  .trim()}`}
                value={formData[field]}
                onChange={handleInputChange}
              />
            </div>
          ))}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opening Hours
            </label>
            {formData.openingHours.map((dayInfo, index) => (
              <div key={index} className="flex items-center space-x-4 mb-4">
                <span>{dayInfo.day}</span>
                <input
                  type="time"
                  className="border p-1"
                  value={dayInfo.openingTime}
                  onChange={(e) =>
                    handleOpeningHoursChange(
                      index,
                      "openingTime",
                      e.target.value
                    )
                  }
                  placeholder="Opening Time"
                />
                <input
                  type="time"
                  className="border p-1"
                  value={dayInfo.closingTime}
                  onChange={(e) =>
                    handleOpeningHoursChange(
                      index,
                      "closingTime",
                      e.target.value
                    )
                  }
                  placeholder="Closing Time"
                />
              </div>
            ))}
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
              value={formData.description}
              onChange={handleInputChange}
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

      <ToastContainer />
    </div>
  );
};

export default ProfileSetupPage;
