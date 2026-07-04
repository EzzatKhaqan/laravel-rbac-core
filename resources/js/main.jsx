import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import router from "./router/index";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "./assets/css/styles.css";

import { AbilityProvider, LayoutProvider } from "./providers";
import { Can } from "./components/Can";
import { PrimeReactProvider } from "primereact/api";
import { ability } from "./lib/abilityInstance";
//==========Tanstack
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();


const el = document.getElementById("root");
const root = createRoot(el);

window.Can = Can;
window.ability = ability;

// Dynamic configuration settings for PrimeReact context
const value = {
    ripple: true,            // Enables smooth modern click interactions
    inputStyle: "filled",    // Keeps modern small input backgrounds clean
};

root.render(
    <AbilityProvider>
        <LayoutProvider>
            <QueryClientProvider client={queryClient}>
                <PrimeReactProvider value={value}>
                    <RouterProvider router={router} />
                </PrimeReactProvider>
            </QueryClientProvider>
        </LayoutProvider>
    </AbilityProvider>
);
