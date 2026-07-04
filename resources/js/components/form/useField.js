// form/useField.js

import { useEffect, useCallback } from "react";
import useForm from "./useForm";

export function getEventValue(e) {
    if (e?.target !== undefined) {
        return e.target.value;
    }

    if (e?.checked !== undefined) {
        return e.checked;
    }

    if (e?.value !== undefined) {
        return e.value;
    }

    return e;
}

export default function useField({
    name,
    rules = [],
    validateOnChange = true,
}) {
    const {
        values,
        errors,
        touched,
        submitted,

        registerField,
        unregisterField,

        setFieldValue,
        setFieldTouched,
        setFieldError,
    } = useForm();

    const value = values[name] ?? "";

    //---------------------------------------
    // validate
    //---------------------------------------

    const validate = useCallback(() => {
        if (!touched[name] && !submitted) {
            return true;
        }

        let error = "";

        for (const rule of rules) {
            const result = rule(value, values);

            if (result !== true) {
                error = result;
                break;
            }
        }

        setFieldError(name, error);

        return error === "";
    }, [value, values, touched, submitted, rules, name]);

    //---------------------------------------
    // register
    //---------------------------------------

    useEffect(() => {
        registerField(name, validate);

        return () => unregisterField(name);
    }, [name, validate]);

    //---------------------------------------
    // handlers
    //---------------------------------------

    const onChange = (e) => {
        const newValue = getEventValue(e);

        setFieldValue(name, newValue);

        if (validateOnChange) {
            // validate using the new value
            let error = "";

            for (const rule of rules) {
                const result = rule(newValue, {
                    ...values,
                    [name]: newValue,
                });

                if (result !== true) {
                    error = result;
                    break;
                }
            }

            setFieldError(name, error);
        }
    };

    const onBlur = () => {
        setFieldTouched(name);

        validate();
    };

    return {
        value,
        error: errors[name],
        touched: touched[name],
        invalid: !!errors[name],
        onChange,
        onBlur,
        validate,
    };
}
