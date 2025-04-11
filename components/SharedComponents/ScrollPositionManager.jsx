import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Component that manages scroll position persistence between page navigations.
 *
 * @param {Object} props
 * @param {string} props.pageId - Unique identifier for the page (e.g., 'keycaps', 'keyboards')
 * @param {boolean} props.enabled - Whether scroll position management is enabled
 * @returns {null} This component doesn't render anything
 */
export default function ScrollPositionManager({ pageId, enabled = true }) {
  const router = useRouter();
  const storageKey = `scrollPosition_${pageId}`;

  // Save scroll position when navigating away
  useEffect(() => {
    if (!enabled) return;

    // Save scroll position before unloading/navigating away
    const handleSaveScrollPosition = () => {
      sessionStorage.setItem(storageKey, window.scrollY.toString());
    };

    // Handle navigation events from Next.js
    const handleRouteChangeStart = () => {
      handleSaveScrollPosition();
    };

    // Handle browser back/forward and manual URL changes
    window.addEventListener("beforeunload", handleSaveScrollPosition);
    router.events.on("routeChangeStart", handleRouteChangeStart);

    return () => {
      window.removeEventListener("beforeunload", handleSaveScrollPosition);
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [enabled, pageId, router.events, storageKey]);

  // Restore scroll position when returning to page
  useEffect(() => {
    if (!enabled) return;

    const restoreScrollPosition = () => {
      const savedPosition = sessionStorage.getItem(storageKey);
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }
    };

    // Small timeout to ensure the DOM has updated
    const timeoutId = setTimeout(restoreScrollPosition, 0);

    return () => clearTimeout(timeoutId);
  }, [enabled, storageKey]);

  return null; // This component doesn't render anything
}
