import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const POLLING_INTERVAL = 30000;

const useUnreadCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session, status } = useSession();
  // console.log(session?.user.id)
  useEffect(() => {
    if (status === "loading" || !session?.user?.id) {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get(
          `/api/notifications/notifcationscount/${session?.user?.id}/`,
          { signal }
        );

        if (response.status === 200) {
          // console.log(response)
          setUnreadCount(response.data.count);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        if (axios.isAxiosError(error)) {
          // console.error("Error fetching unread count:", error.response?.data || error.message);
        } else {
          // console.error("Error fetching unread count:", error);
        }
      }
    };

    fetchUnreadCount();

    const intervalId = setInterval(fetchUnreadCount, POLLING_INTERVAL);

    return () => {
      controller.abort();
      clearInterval(intervalId);
    };
  }, [session?.user?.id, status]);

  return unreadCount;
};

export default useUnreadCount;
