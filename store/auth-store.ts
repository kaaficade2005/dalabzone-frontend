import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * 1. User type (adjust based on your backend)
 */
export type User = {
    id: string;
    name: string;
    email: string;
    role?: "user" | "admin";
};

/**
 * 2. Store state type
 */
type AuthState = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    hasHydrated: boolean;

    login: (user: User, token: string) => void;
    logout: () => void;
    setHasHydrated: (state: boolean) => void;

    // optional if you plan to use it later
    fetchUser?: () => Promise<void>;
};

/**
 * 3. Zustand store
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            hasHydrated: false,

            login: (user, token) => {
                set({
                    user,
                    token,
                    isAuthenticated: true,
                });
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });

                toast.success("Successfully logged out");
            },

            setHasHydrated: (state) => {
                set({ hasHydrated: state });
            },

            // optional placeholder
            fetchUser: async () => {
                const token = get().token;
                if (!token) return;

                // example API call (replace with your backend)
                try {
                    // const res = await fetch("/api/me", {
                    //   headers: { Authorization: `Bearer ${token}` },
                    // });
                    // const data = await res.json();

                    // set({ user: data.user });
                } catch (err) {
                    console.error("fetchUser failed", err);
                }
            },
        }),
        {
            name: "auth-storage",

            onRehydrateStorage: () => (state) => {
                if (!state) return;

                state.setHasHydrated(true);

                // safe call
                state.fetchUser?.();
            },
        }
    )
);