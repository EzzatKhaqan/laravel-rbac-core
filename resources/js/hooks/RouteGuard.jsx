import { Navigate, useMatches } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";
import {
    DashboardLayout,
    DefaultLayout,
} from "@/layouts";
import InitLoader from "../components/loader/InitLoader";
import { ability } from "../lib/abilityInstance";

import UnAuthorized from "../views/errors/401";

const RouteGuard = () => {
    const matches = useMatches();

    const initialize = useAuthStore(
        (state) => state.initialize
    );

    const isInitialized = useAuthStore(
        (state) => state.isInitialized
    );

    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated
    );

    useEffect(() => {
        initialize();
    }, [initialize]);

    const currentRoute =
        matches[matches.length - 1];

    const requiresAuth =
        currentRoute?.handle?.requiresAuth ?? false;


    if (!isInitialized && requiresAuth) {
        return <InitLoader />;
    }

    if (
        isAuthenticated &&
        currentRoute.pathname.startsWith("/auth")
    ) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    if (
        requiresAuth &&
        !isAuthenticated
    ) {
        return (
            <Navigate
                to="/auth/login"
                replace
            />
        );
    }

    if (requiresAuth) {
        if (currentRoute.handle?.permissions) {

            let hasAccess = false;
            currentRoute.handle.permissions.forEach(permission => {
                if (ability.can("view", permission.toLowerCase())) {
                    hasAccess = true;
                    return;
                }
                hasAccess = false;
            });

            if (!hasAccess) {
                console.log("Access Denied: User lacks required permissions.");
                // Return this view inside the layout to block the unauthorized content
                return <UnAuthorized />;
            }
        }
    }

    return requiresAuth ? (
        <DashboardLayout />
    ) : (
        <DefaultLayout />
    );
};

export default RouteGuard;