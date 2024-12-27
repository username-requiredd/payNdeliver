"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useProfileDetails } from "./useProfileDetails";
import ImageUpload from "@/components/Imageupload";
import { InputField } from "./inputfield";
const ProfilePage = () => {
  const { data: session } = useSession();
  const {
    state: { loading, isEditing, editedData, errors },
    actions: {
      handleInputChange,
      handleEdit,
      handleCancel,
      handleSubmit,
      handleImageUpload,
      handleOpeningHoursChange,
    },
  } = useProfileDetails({ session });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
            {editedData.coverImage && (
              <img
                src={editedData.coverImage}
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
                      className="inline-flex items-center px-4 py-2 bg-white text-gray-700 
                        rounded-md shadow-sm hover:bg-gray-50 focus:outline-none 
                        focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="inline-flex items-center px-4 py-2 bg-green-600 
                        text-white rounded-md shadow-sm hover:bg-green-700 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 
                        focus:ring-green-500"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center px-4 py-2 bg-white 
                      text-gray-700 rounded-md shadow-sm hover:bg-gray-50 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 
                      focus:ring-indigo-500"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="px-6 py-8">
            {isEditing && (
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Update Cover Image
                </label>
                <div
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 
                  border-gray-300 border-dashed rounded-md"
                >
                  <div className="space-y-1 text-center">
                    <ImageUpload
                      onImageUpload={(url) =>
                        handleImageUpload("coverImage", url)
                      }
                    />
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
                value={editedData.address}
                error={errors.address}
                disabled={!isEditing}
                onChange={handleInputChange}
              />
              <InputField
                label="Wallet Address"
                name="walletAddress"
                value={editedData.walletAddress}
                error={errors.walletAddress}
                disabled={!isEditing}
                onChange={handleInputChange}
              />
              <InputField
                label="Account Number"
                name="accountNumber"
                value={editedData.accountNumber}
                error={errors.accountNumber}
                disabled={!isEditing}
                onChange={handleInputChange}
              />
              <InputField
                label="Account Name"
                name="accountName"
                value={editedData.accountName}
                error={errors.accountName}
                disabled={!isEditing}
                onChange={handleInputChange}
              />
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Opening Hours
              </h3>
              {errors.openingHours && (
                <p className="text-sm text-red-600 mb-2" role="alert">
                  {errors.openingHours}
                </p>
              )}
              <div className="grid grid-cols-1 gap-4">
                {editedData.openingHours.map((dayInfo, index) => (
                  <div
                    key={dayInfo.day}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-md"
                  >
                    <span className="w-24 font-medium">{dayInfo.day}</span>
                    <input
                      type="time"
                      className={`
                        border rounded-md p-2
                        ${!isEditing ? "bg-gray-100" : "bg-white"}
                      `}
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
                      className={`
                        border rounded-md p-2
                        ${!isEditing ? "bg-gray-100" : "bg-white"}
                      `}
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
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Business Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={editedData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                disabled={!isEditing}
                className={`
                  shadow-sm focus:ring-indigo-500 focus:border-indigo-500 
                  block w-full sm:text-sm border-gray-300 rounded-md p-3 
                  transition-colors duration-200
                  ${!isEditing ? "bg-gray-50" : "bg-white"}
                  ${errors.description ? "border-red-500" : ""}
                `}
                aria-invalid={errors.description ? "true" : "false"}
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
              />
              {errors.description && (
                <p
                  id="description-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.description}
                </p>
              )}
            </div>

            {/* Save/Cancel buttons for mobile view */}
            {isEditing && (
              <div className="mt-8 flex justify-end space-x-4 md:hidden">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-white text-gray-700 rounded-md 
                    shadow-sm hover:bg-gray-50 focus:outline-none 
                    focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-md 
                    shadow-sm hover:bg-green-700 focus:outline-none 
                    focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ProfilePage;
