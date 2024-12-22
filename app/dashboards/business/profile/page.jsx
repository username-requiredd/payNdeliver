"use client";
import React, { useEffect, useState } from "react";
import { Camera, Loader2, Edit2, Save, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/Imageupload";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const initialFormState = {
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
  };

  const [formData, setFormData] = useState(initialFormState);
  const [originalData, setOriginalData] = useState(initialFormState);

  const fetchProfile = async (api, signal) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(api, { signal });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const profile = await response.json();
      console.log(profile);
      const profileData = {
        ...initialFormState,
        ...profile.data,
        openingHours:
          profile.data.openingHours || initialFormState.openingHours,
      };

      setFormData(profileData);
      setOriginalData(profileData);
      setIsEditing(false);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError("Failed to load profile data");
      toast.error("Failed to load profile data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;
    const controller = new AbortController();
    fetchProfile(`/api/business/${session.user.id}`, controller.signal);
    return () => controller.abort();
  }, [session?.user?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleOpeningHoursChange = (index, field, value) => {
    const newOpeningHours = [...formData.openingHours];
    newOpeningHours[index][field] = value;
    setFormData((prevData) => ({ ...prevData, openingHours: newOpeningHours }));
  };

  const handleSaveProfile = async () => {
    if (!session?.user?.id) {
      toast.error("Please sign in to update your profile");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/business/${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      setOriginalData(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      setError("Failed to update profile");
      toast.error("Failed to update profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = "text", value, disabled }) => (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={handleInputChange}
        disabled={!isEditing || disabled}
        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm 
          border-gray-300 rounded-md p-3 transition-colors duration-200
          ${!isEditing ? "bg-gray-50" : "bg-white"}
          ${disabled ? "cursor-not-allowed" : ""}`}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
            {formData.coverImage && (
              <img
                src={formData.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute bottom-4 left-6">
              <h1 className="text-3xl font-bold text-white">
                Business Profile
              </h1>
            </div>
            {!loading && (
              <div className="absolute top-4 right-4 space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : (
              <>
                {isEditing && (
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Update Cover Image
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <ImageUpload
                            onImageUpload={(url) =>
                              setFormData((prev) => ({
                                ...prev,
                                coverImage: url,
                              }))
                            }
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Business Address"
                    name="address"
                    value={formData.address}
                  />
                  <InputField
                    label="Wallet Address"
                    name="walletAddress"
                    value={formData.walletAddress}
                  />
                  <InputField
                    label="Account Number"
                    name="accountNumber"
                    value={formData.accountNumber}
                  />
                  <InputField
                    label="Account Name"
                    name="accountName"
                    value={formData.accountName}
                  />
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Opening Hours
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {formData.openingHours.map((dayInfo, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded-md"
                      >
                        <span className="w-24 font-medium">{dayInfo.day}</span>
                        <input
                          type="time"
                          className={`border rounded-md p-2 ${
                            !isEditing ? "bg-gray-100" : "bg-white"
                          }`}
                          value={dayInfo.openingTime}
                          onChange={(e) =>
                            handleOpeningHoursChange(
                              index,
                              "openingTime",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                        />
                        <span>to</span>
                        <input
                          type="time"
                          className={`border rounded-md p-2 ${
                            !isEditing ? "bg-gray-100" : "bg-white"
                          }`}
                          value={dayInfo.closingTime}
                          onChange={(e) =>
                            handleOpeningHoursChange(
                              index,
                              "closingTime",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Description
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm 
                      border-gray-300 rounded-md p-3 transition-colors duration-200
                      ${!isEditing ? "bg-gray-50" : "bg-white"}`}
                  ></textarea>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProfilePage;
