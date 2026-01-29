"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { initDb } from "@/lib/mockDb";

export function ClientInitializer() {
  const { refreshDb, setSession } = useStore();
  
  useEffect(() => {
    // Initialize database on client mount
    initDb();
    refreshDb();
    
    // Initialize session from localStorage
    const storedSession = localStorage.getItem("hubs-network-session");
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        setSession(session);
      } catch (error) {
        console.error("Failed to parse stored session:", error);
      }
    }
  }, [refreshDb, setSession]);
  
  return null;
}
