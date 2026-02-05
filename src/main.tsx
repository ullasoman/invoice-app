import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import React, { useEffect, useState } from "react";

/* -------------------------------------------------------------------------- */
/* Smart PWA Component – Handles Install + Update Toasts                   */
/* -------------------------------------------------------------------------- */
function SmartPWA() {
  const [showInstall, setShowInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showUpdate, setShowUpdate] = useState(false);

  // Listen for beforeinstallprompt (Installable PWA)
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      console.log("📱 beforeinstallprompt fired — app is installable ✅");
      e.preventDefault(); // Prevent Chrome’s mini-infobar
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  // Listen for new SW version activation
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("🔄 New version detected");
        setShowUpdate(true);
      });
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("✅ User installed Fatorah PWA");
    } else {
      console.log("❌ User dismissed Fatorah install prompt");
    }

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const handleReload = () => {
    console.log("🔁 Reloading new version...");
    window.location.reload();
  };

  if (!showInstall && !showUpdate) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-[#1C1C1C] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 border border-gray-700">
        {showInstall && (
          <>
            <p className="text-sm">📱 Install Fatorah on your device?</p>
            <button
              onClick={handleInstall}
              className="bg-[#F5E115] text-black font-semibold px-4 py-1.5 rounded-md hover:bg-[#E0D212] transition"
            >
              Install
            </button>
          </>
        )}

        {showUpdate && (
          <>
            <p className="text-sm">🚀 A new version of Fatorah is available.</p>
            <button
              onClick={handleReload}
              className="bg-[#F5E115] text-black font-semibold px-4 py-1.5 rounded-md hover:bg-[#E0D212] transition"
            >
              Reload
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Root Application Wrapper                                                */
/* -------------------------------------------------------------------------- */
function RootApp() {
  return (
    <>
      <App />
      <SmartPWA />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Mount Application                                                      */
/* -------------------------------------------------------------------------- */
createRoot(document.getElementById("root")!).render(<RootApp />);

/* -------------------------------------------------------------------------- */
/* Register Service Worker (after page load)                              */
/* -------------------------------------------------------------------------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration.scope);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
