"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { PublicKey } from "@solana/web3.js";
const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const createInitialState = () => ({
  image: null,
  coverImage: null,
  address: "",
  walletAddress: "",
  accountNumber: "",
  accountName: "",
  description: "",
  openingHours: DAYS_OF_WEEK.map((day) => ({
    day,
    openingTime: "",
    closingTime: "",
  })),
});

export const useProfileDetails = ({ session }) => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(createInitialState);
  const [editedData, setEditedData] = useState(createInitialState);
  const [errors, setErrors] = useState({});
  const [imageUploading, setImageUploading] = useState(false);

  const resetState = useCallback(() => {
    setIsEditing(false);
    setEditedData({ ...profileData });
    setErrors({});
  }, [profileData]);

  const fetchProfile = useCallback(
    async ({ signal }) => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        setErrors({});

        const response = await fetch(`/api/business/${session?.user?.id}`, {
          signal,
          headers: {
            Authorization: `Bearer ${session?.accessToken || ""}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        const profileWithDefaults = {
          ...createInitialState(),
          ...data.data,
          openingHours:
            data.data?.openingHours?.map((hour) => ({ ...hour })) ||
            createInitialState().openingHours,
        };

        setProfileData(profileWithDefaults);
        setEditedData(profileWithDefaults);
        setIsEditing(false);
      } catch (error) {
        if (error.name === "AbortError") {
          setErrors({});
          return;
        }
        setErrors({ general: error.message });
      } finally {
        setLoading(false);
      }
    },
    [session?.user?.id, session?.accessToken]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchProfile({ signal: controller.signal });
    return () => controller.abort();
  }, [fetchProfile]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const { address, accountNumber, accountName, walletAddress, openingHours } =
      editedData;

    if (!address?.trim()) newErrors.address = "Business address is required";
    if (!accountNumber?.trim())
      newErrors.accountNumber = "Account number is required";
    if (!accountName?.trim())
      newErrors.accountName = "Account name is required";

    if (walletAddress) {
      const trimmedAddress = walletAddress.trim();
      if (trimmedAddress) {
        try {
          new PublicKey(trimmedAddress);
          // If the address is valid but has whitespace, update it
          if (trimmedAddress !== walletAddress) {
            handleInputChange("walletAddress", trimmedAddress);
          }
        } catch (error) {
          newErrors.walletAddress =
            "Please enter a valid Solana wallet address";
        }
      }
    }

    if (accountNumber && !/^\d{10,}$/.test(accountNumber.trim())) {
      newErrors.accountNumber = "Account number must be at least 10 digits";
    }

    openingHours.forEach((day) => {
      if (
        (day.openingTime && !day.closingTime) ||
        (!day.openingTime && day.closingTime)
      ) {
        newErrors.openingHours = `${day.day}: Both opening and closing times are required`;
      }
      if (
        day.openingTime &&
        day.closingTime &&
        day.openingTime >= day.closingTime
      ) {
        newErrors.openingHours = `${day.day}: Closing time must be after opening time`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [editedData]);

  const handleInputChange = useCallback((field, value) => {
    // Immediately validate wallet address when it changes
    if (field === "walletAddress" && value) {
      try {
        new PublicKey(value.trim());
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          walletAddress: "Please enter a valid Solana wallet address",
        }));
        // Still update the value to show user input
        setEditedData((prev) => ({ ...prev, [field]: value }));
        return;
      }
    }

    setEditedData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const handleOpeningHoursChange = useCallback((index, field, value) => {
    setEditedData((prev) => {
      const newHours = [...prev.openingHours];
      newHours[index] = { ...newHours[index], [field]: value };
      return { ...prev, openingHours: newHours };
    });
    setErrors((prev) => ({ ...prev, openingHours: "" }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!session?.user?.id) {
      toast.error("Please sign in to update your profile");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    try {
      setLoading(true);
      const csrfToken = await fetch("/api/csrf")
        .then((r) => r.json())
        .then((d) => d.token);

      const response = await fetch(`/api/business/${session?.user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
          Authorization: `Bearer ${session.accessToken || ""}`,
        },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setProfileData({ ...editedData });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [editedData, session?.user?.id, session?.accessToken, validateForm]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditedData({ ...profileData });
    setErrors({});
  }, [profileData]);

  const handleCancel = useCallback(() => {
    const hasChanges =
      JSON.stringify(editedData) !== JSON.stringify(profileData);
    if (hasChanges) {
      const confirmCancel = window.confirm(
        "Are you sure you want to discard your changes?"
      );
      if (!confirmCancel) return;
    }
    resetState();
  }, [editedData, profileData, resetState]);

  const handleImageUpload = async (type, url) => {
    try {
      setImageUploading(true);
      if (!url) throw new Error("No image URL provided");
      handleInputChange(type, url);
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  return {
    state: {
      loading,
      isEditing,
      profileData,
      editedData,
      errors,
      imageUploading,
    },
    actions: {
      handleInputChange,
      handleEdit,
      handleCancel,
      handleSubmit,
      handleImageUpload,
      handleOpeningHoursChange,
    },
  };
};
