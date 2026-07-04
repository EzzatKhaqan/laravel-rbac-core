import { createContext, useContext } from "react";

export const FormContext = createContext(null);

export const useFormContext = () => {
    const context = useContext(FormContext);

    if (!context) {
        throw new Error("useFormContext must be used inside BaseForm");
    }

    return context;
};