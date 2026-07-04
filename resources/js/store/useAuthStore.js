import { create } from "zustand";
import apiClient from "@/services/apiClient";
import { defineAbilitiesFor } from "../lib/ability";
import { ability } from "../lib/abilityInstance";
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

const useAuthStore = create((set, get) => ({
    user: null,
    abilities: [],
    token: null,
    isAuthenticated: false,
    isInitialized: false,

    initialize: async () => {
        const token = localStorage.getItem(TOKEN_KEY);

        if (!token) {
            set({
                token: null,
                user: null,
                abilities: [],
                isAuthenticated: false,
                isInitialized: true,
            });

            return;
        }

        set({ token });

        try {
            await apiClient.get("/auth/check");

            const [profile, abilitiesResponse] = await Promise.all([
                apiClient.get("/auth/profile"),
                apiClient.get("/auth/abilities"),
            ]);

            const abilities = abilitiesResponse.data || [];

            get().setAbility(abilities);

            set({
                token,
                user: profile.data.user,
                abilities,
                isAuthenticated: true,
                isInitialized: true,
            });
        } catch {
            get().removeToken();

            set({
                isInitialized: true,
            });
        }
    },
    setToken: (token) => {
        localStorage.setItem(TOKEN_KEY, token);

        set({
            token,
            isAuthenticated: true,
        });
    },
    setIsInitialized: (status) => {
        set({ isInitialized: status });
    },
    removeToken: () => {
        localStorage.removeItem(TOKEN_KEY);

        set({
            token: null,
            user: null,
            abilities: [],
            isAuthenticated: false,
        });
    },
    fetchProfile: async () => {
        const { data } = await apiClient.get("/auth/profile");

        set({
            user: data.user,
        });

        return data.user;
    },
    fetchAbilities: async () => {
        const { data } = await apiClient.get("/auth/abilities");

        get().setAbility(data);
        set({
            abilities: data || [],
        });

        return data;
    },
    setAbility: (permissions) => {
        const newAbility = new defineAbilitiesFor(permissions);
        ability.update(newAbility.rules);
    },
}));

export default useAuthStore;
