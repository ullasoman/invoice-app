"use client";

import React, { useEffect, useState } from "react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("✅ User accepted the install prompt");
    } else {
      console.log("❌ User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1C1C1C] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 z-50">
      <p className="text-sm">📱 Install Fatorah on your device?</p>
      <button
        onClick={handleInstall}
        className="bg-[#F5E115] text-black font-semibold px-4 py-1.5 rounded-md hover:bg-[#E0D212] transition"
      >
        Install
      </button>
    </div>
  );
}
