import { create, type StateStorage } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

type SessionState = {
  isLoggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      setLoggedIn: (v: boolean) => set({ isLoggedIn: v }),
    }),
    {
      name: "auth-session-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : noopStorage
      ),
    }
  )
);
