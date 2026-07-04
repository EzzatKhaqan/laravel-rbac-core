import { useCallback, useMemo, useRef, useState } from "react";
import { FormContext } from "./FormContext";

export default function BaseForm({
    children,
    initialValues = {},
    onSubmit,
}) {

    //------------------------------------------
    // State
    //------------------------------------------

    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const submittedRef = useRef(false);
    //------------------------------------------
    // Registered Fields
    //------------------------------------------

    const fields = useRef({});

    const registerField = useCallback((name, field) => {
        fields.current[name] = field;
    }, []);

    const unregisterField = useCallback((name) => {
        delete fields.current[name];
    }, []);

    //------------------------------------------
    // Values
    //------------------------------------------

    const setFieldValue = useCallback((name, value) => {
        setValues(prev => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    //------------------------------------------
    // Errors
    //------------------------------------------

    const setFieldError = useCallback((name, error) => {
        setErrors(prev => ({
            ...prev,
            [name]: error,
        }));
    }, []);

    //------------------------------------------
    // Validate All
    //------------------------------------------

    const validateAll = useCallback(() => {

        let valid = true;

        Object.values(fields.current).forEach(validate => {
            if (!validate()) {
                valid = false;
            }
        });

        return valid;
    }, []);

    //------------------------------------------
    // Submit
    //------------------------------------------

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        submittedRef.current = true;
        const isValid = validateAll();
        onSubmit(isValid);
    };

    //------------------------------------------
    // Context
    //------------------------------------------

    const context = useMemo(() => ({
        values,
        errors,
        submitted,
        registerField,
        unregisterField,
        setFieldValue,
        setFieldError,
        validateAll,
        submittedRef
    }), [
        values,
        errors,
        submitted,
        registerField,
        unregisterField,
        setFieldValue,
        setFieldError,
        validateAll,
        submittedRef
    ]);

    //------------------------------------------

    return (
        <FormContext.Provider value={context}>
            <form onSubmit={handleSubmit}>
                {children}
            </form>
        </FormContext.Provider>
    );

}