"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const NotificationCount = () => {
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
    const {data:session} = useSession()
  const fetchNotificationsCount = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/notifications/${session?.user?.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      if (response.status === 200) {
        const count = response.data?.data.filter((notif)=>notif.read === false) || 0; 
        setNotificationsCount(count);
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (err) {
      setError("Failed to fetch notification count.");
      console.error("Error fetching notifications count:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotificationsCount();
    }
  }, [session?.user?.id]);


  return notificationsCount
};

export default NotificationCount;
