import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useReturnUserRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if user has visited before
    const hasVisited = localStorage.getItem("hasVisitedBefore");

    // Check if the user came from an external source
    const isExternalReferrer =
      !document.referrer || !document.referrer.includes(window.location.host);
    // console.log('external referrer:', isExternalReferrer);

    // Parse the current URL to check for skipRedirect
    const rawParams = window.location.search;
    const params = new URLSearchParams(rawParams);
    const skipRedirect = params.get("skipRedirect") === "true";

    // console.log('params raw:', rawParams);
    // console.log('params parsed:', params);
    // console.log('skipRedirect:', skipRedirect);

    // Redirect only if conditions are met
    if (hasVisited === "true" && isExternalReferrer && !skipRedirect) {
      // console.log('Redirecting to /stores');
      router.push("/stores");
    } else {
      // console.log('Setting hasVisited to true');
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, [router]);
};

export default useReturnUserRedirect;
