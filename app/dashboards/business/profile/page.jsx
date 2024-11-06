"use client";
import React, { useEffect, useState } from "react";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  Building,
  Edit2,
  Save,
  XCircle,
} from "lucide-react";
import ImageUpload from "@/components/Imageupload";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BusinessProfile = () => {
  const [image, setImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const id = session?.user?.id;
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [originalData, setOriginalData] = useState(null); // To store original profile data for cancel

  const handleImageUpload = (url) => {
    setImage(url);
    setCoverImage(url);
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/business/${id}`, { signal });
        if (!response.ok) throw new Error("Error fetching business data!");
        const data = await response.json();
        setProfileData(data.data);
        setOriginalData(data.data); // Store the original data for reverting
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message);
        // console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    return () => controller.abort();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleOpeningHoursChange = (day, field, value) => {
    const updatedHours = profileData.openingHours.map((hours) =>
      hours.day === day ? { ...hours, [field]: value } : hours
    );
    setProfileData({ ...profileData, openingHours: updatedHours });
  };

  const handleSave = async () => {
    try {
      const updatedProfileData = {
        ...profileData,
        coverImage: coverImage,
      };
      const response = await fetch(`/api/business/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfileData),
      });
      if (response.ok) {
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(
          "Failed to update profile. Check your connection or try again later."
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile.");
    }
  };

  const handleCancelEdit = () => {
    setProfileData(originalData); // Revert to the original data
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="relative h-64 rounded-t-lg overflow-hidden mb-6">
        <img
          src={profileData?.coverImage || coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-start">
          <h1 className="text-4xl font-bold text-white px-6 py-4">
            {profileData?.businessName}
          </h1>
        </div>
      </div>
      <div className={isEditing ? "block" : "hidden"}>
        <ImageUpload onImageUpload={handleImageUpload} image={image} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <InfoItem
            icon={<Building className="w-5 h-5 text-gray-500" />}
            label="Business Name"
            value={profileData?.businessName}
            isEditing={isEditing}
            name="businessName"
            onChange={handleInputChange}
          />
          <InfoItem
            icon={<Building className="w-5 h-5 text-gray-500" />}
            label="Business Type"
            value={profileData?.businessType}
            isEditing={isEditing}
            name="businessType"
            onChange={handleInputChange}
          />
          <InfoItem
            icon={<Phone className="w-5 h-5 text-gray-500" />}
            label="Phone"
            value={profileData?.phone}
            isEditing={isEditing}
            name="phone"
            onChange={handleInputChange}
          />
          <InfoItem
            icon={<Mail className="w-5 h-5 text-gray-500" />}
            label="Email"
            value={profileData?.email}
            isEditing={isEditing}
            name="email"
            onChange={handleInputChange}
          />
          <InfoItem
            icon={<MapPin className="w-5 h-5 text-gray-500" />}
            label="Address"
            value={profileData?.address}
            isEditing={isEditing}
            name="address"
            onChange={handleInputChange}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 text-gray-500 mr-2" />
            Opening Hours
          </h2>
          <div className="space-y-2">
            {profileData?.openingHours.map((hours) => (
              <div
                key={hours.day}
                className="flex justify-between items-center"
              >
                <span className="font-medium">{hours.day}</span>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <input
                      type="time"
                      value={hours.openingTime || ""}
                      onChange={(e) =>
                        handleOpeningHoursChange(
                          hours.day,
                          "openingTime",
                          e.target.value
                        )
                      }
                      className="border rounded-md px-2 py-1"
                    />
                    <input
                      type="time"
                      value={hours.closingTime || ""}
                      onChange={(e) =>
                        handleOpeningHoursChange(
                          hours.day,
                          "closingTime",
                          e.target.value
                        )
                      }
                      className="border rounded-md px-2 py-1"
                    />
                  </div>
                ) : (
                  <span>
                    {hours.openingTime && hours.closingTime
                      ? `${hours.openingTime} - ${hours.closingTime}`
                      : "Closed"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-600 transition-colors"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-600 transition-colors"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600 transition-colors"
          >
            <Edit2 className="w-5 h-5 mr-2" />
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value, isEditing, name, onChange }) => (
  <div className="flex items-start mb-4">
    <div className="mr-4 mt-1">{icon}</div>
    <div>
      <h3 className="font-medium text-gray-700">{label}</h3>
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
        />
      ) : (
        <p className="text-gray-600">{value}</p>
      )}
    </div>
  </div>
);

export default BusinessProfile;
