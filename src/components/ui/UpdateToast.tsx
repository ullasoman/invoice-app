"use client";

import React, { useEffect, useState } from "react";

export function UpdateToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // When a new service worker takes control of the page
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("🔄 New version detected");
        setVisible(true);
      });
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="bg-[#1C1C1C] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-4 border border-gray-700">
        <p className="text-sm">🚀 A new version of Yasar Invoice is available.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#F5E115] text-black font-semibold px-4 py-1.5 rounded-md hover:bg-[#E0D212] transition"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
