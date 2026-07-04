import apiClient from "@/services/apiClient";
import useAuthStore from "@/store/useAuthStore";
import { useState } from "react";

const useAuth = () => {
    const setToken = useAuthStore((state) => state.setToken);
    const removeToken = useAuthStore((state) => state.removeToken);
    const fetchProfile = useAuthStore((state) => state.fetchProfile);
    const fetchAbilities = useAuthStore((state) => state.fetchAbilities);
    const setIsInitialized = useAuthStore((state) => state.setIsInitialized);
    const [loading, setLoading] = useState({ login: false, logout: false });
    const login = async (credentials) => {
        try {
            const { data } = await apiClient.post("/auth/login", credentials);

            setIsInitialized(false);
            setToken(data.token);

            const [user] = await Promise.all([
                fetchProfile(),
                fetchAbilities(),
            ]);

            setIsInitialized(true);
            return {
                success: true,
                user,
            };
        } catch (error) {
            return {
                success: false,
                errors: error.response?.data ?? "Login failed",
            };
        }
    };

    const logout = async () => {
        setLoading({ logout: true });
        try {
            await apiClient.post("/auth/logout");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading({ logout: false });
            removeToken();
        }
    };

    return {
        login,
        logout,
        loading,
        setLoading,
    };
};

export default useAuth;
