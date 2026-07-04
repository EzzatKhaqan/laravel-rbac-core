import { createContext, useContext } from "react";
import { ability } from "@/lib/abilityInstance";

export const AbilityContext = createContext(ability);

export const AbilityProvider = ({ children }) => {
    return (
        <AbilityContext.Provider value={ability}>
            {children}
        </AbilityContext.Provider>
    );
};

export const useAbility = () => useContext(AbilityContext);