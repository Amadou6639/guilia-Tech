import { useEffect } from "react";

const usePageTracking = () => {
  useEffect(() => {
    const trackPageView = () => {
      const pageName = window.location.pathname;

      // Ne pas tracker les pages admin
      if (pageName.startsWith("/admin")) {
        console.log("🚫 Page admin non trackée:", pageName);
        return;
      }

      console.log("📊 Tracking page:", pageName);

      fetch(`${process.env.REACT_APP_API_URL}/api/visits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: pageName,
          user_agent: navigator.userAgent,
          referrer: document.referrer || "direct",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("✅ Page tracked successfully:", data);
        })
        .catch((error) => {
          console.error("❌ Error tracking page:", error);
        });
    };

    // Track la page initiale
    trackPageView();

    // Écouter les changements de route
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    // Surcharger pushState
    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      trackPageView();
    };

    // Surcharger replaceState
    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      trackPageView();
    };

    // Écouter les événements popstate (navigation avant/arrière)
    window.addEventListener("popstate", trackPageView);

    // Nettoyage
    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", trackPageView);
    };
  }, []);
};

export default usePageTracking;
