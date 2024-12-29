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

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    image: null,
    coverImage: null,
    address: "",
    walletAddress: "",
    accountNumber: "",
    accountName: "",
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

  const formFields = [
    {
      id: "address",
      label: "Business Address",
      placeholder: "Enter your business address",
    },
    {
      id: "walletAddress",
      label: "SOL Wallet Address",
      placeholder: "Enter your Solana wallet address",
    },
    {
      id: "accountNumber",
      label: "Account Number",
      placeholder: "Enter your account number",
    },
    {
      id: "accountName",
      label: "Account Name",
      placeholder: "Enter your account name",
    },
  ];

  const isValidSolanaAddress = (address) => {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  };

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

  const validateForm = () => {
    if (!formData.address.trim()) {
      toast.error("Business address is required");
      return false;
    }
    if (!formData.walletAddress.trim()) {
      toast.error("Wallet address is required");
      return false;
    }
    if (!isValidSolanaAddress(formData.walletAddress.trim())) {
      toast.error("Please enter a valid Solana wallet address");
      return false;
    }
    if (!formData.accountNumber.trim()) {
      toast.error("Account number is required");
      return false;
    }
    if (!formData.accountName.trim()) {
      toast.error("Account name is required");
      return false;
    }
    return true;
  };

  const handleSaveProfile = async () => {
    if (!session?.user) {
      toast.error("No session found. Please sign in.");
      return;
    }

    if (!validateForm()) {
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
        body: JSON.stringify({
          ...formData,
          walletAddress: formData.walletAddress.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Account setup completed successfully! Redirecting...", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        router.push("products/add");
      }, 2000);
    } catch (error) {
      // console.error("Error updating profile:", error);
      toast.error("Error updating profile. Please try again.");
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
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors">
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

          {formFields.map((field) => (
            <div key={field.id} className="mb-6">
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {field.label}
              </label>
              <input
                type="text"
                id={field.id}
                name={field.id}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                placeholder={field.placeholder}
                value={formData[field.id]}
                onChange={handleInputChange}
              />
              {field.id === "walletAddress" &&
                formData[field.id] &&
                !isValidSolanaAddress(formData[field.id]) && (
                  <p className="mt-1 text-sm text-red-600">
                    Please enter a valid Solana wallet address
                  </p>
                )}
            </div>
          ))}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opening Hours
            </label>
            <div className="space-y-4 rounded-md border border-gray-200 p-4">
              {formData.openingHours.map((dayInfo, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <span className="w-24 font-medium">{dayInfo.day}</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      className="border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={dayInfo.openingTime}
                      onChange={(e) =>
                        handleOpeningHoursChange(
                          index,
                          "openingTime",
                          e.target.value
                        )
                      }
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      className="border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={dayInfo.closingTime}
                      onChange={(e) =>
                        handleOpeningHoursChange(
                          index,
                          "closingTime",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Business Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
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
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
