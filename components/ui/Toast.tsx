"use client";

import React from "react";
import { useStore } from "@/store/useStore";

export function ToastContainer() {
  const { toasts, removeToast } = useStore();
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded border-2 border-black shadow-lg min-w-[300px] flex items-center justify-between ${
            toast.type === "success"
              ? "bg-green-100"
              : toast.type === "error"
              ? "bg-red-100"
              : "bg-accent1"
          }`}
        >
          <span className="font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-xl font-bold hover:text-gray-600"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
