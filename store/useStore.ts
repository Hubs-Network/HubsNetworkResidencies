import { create } from "zustand";
import { Session, SessionType, MockDatabase } from "@/lib/types";
import { initDb, getDb, saveToStorage } from "@/lib/mockDb";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface StoreState {
  // Session
  session: Session;
  setSession: (session: Session) => void;
  logout: () => void;
  
  // Database
  db: MockDatabase;
  refreshDb: () => void;
  
  // Toast notifications
  toasts: Toast[];
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
  
  // Modal state
  modalOpen: boolean;
  modalContent: React.ReactNode | null;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial session
  session: { type: "GUEST" },
  
  setSession: (session: Session) => {
    set({ session });
    if (typeof window !== "undefined") {
      localStorage.setItem("hubs-network-session", JSON.stringify(session));
    }
  },
  
  logout: () => {
    set({ session: { type: "GUEST" } });
    if (typeof window !== "undefined") {
      localStorage.removeItem("hubs-network-session");
    }
  },
  
  // Database - initialize only on client
  db: typeof window !== "undefined" ? initDb() : { hubs: [], pilgrims: [], patrons: [], seasons: [], currentSeason: 0 },
  
  refreshDb: () => {
    set({ db: getDb() });
  },
  
  // Toasts
  toasts: [],
  
  addToast: (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, 5000);
  },
  
  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  
  // Modal
  modalOpen: false,
  modalContent: null,
  
  openModal: (content: React.ReactNode) => {
    set({ modalOpen: true, modalContent: content });
  },
  
  closeModal: () => {
    set({ modalOpen: false, modalContent: null });
  },
}));
