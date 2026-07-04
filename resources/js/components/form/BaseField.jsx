import {
    Children,
    cloneElement,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { useFormContext } from "./FormContext";
import { parseRules } from "../../utils";
import { getEventValue } from "./useField";

export default function BaseField({
    name,
    label,
    rules = [],
    children,
    className = "",
    validateOnChange = true,
}) {

    const {
        values,
        errors,
        submitted,
        registerField,
        unregisterField,
        setFieldValue,
        setFieldError,
        submittedRef
    } = useFormContext();

    const value = values[name] ?? "";
    const [touched, setTouched] = useState({});

    //-------------------------------------------------
    // Validation
    //-------------------------------------------------

    const validators = useMemo(
        () => parseRules(rules),
        [rules]
    );

    const validate = useCallback((currentValue = value) => {
        let error = "";
        const shouldValidate =
            touched ||
            submittedRef.current ||
            currentValue !== "";

        if (!shouldValidate) {
            setFieldError(name, "");
            return true;
        }

        for (const validator of validators) {

            const result = validator(
                currentValue,
                {
                    ...values,
                    [name]: currentValue,
                }
            );

            if (result !== true) {
                error = result;
                break;
            }
        }

        setFieldError(name, error);

        return error === "";

    }, [
        name,
        value,
        values,
        touched,
        submitted,
        validators,
        setFieldError,
    ]);

    //-------------------------------------------------
    // Register
    //-------------------------------------------------

    useEffect(() => {
        registerField(name, validate);
        return () => unregisterField(name);

    }, [
        name,
        validate,
        registerField,
        unregisterField,
    ]);

    //-------------------------------------------------
    // Change
    //-------------------------------------------------

    const handleChange = (e) => {

        const newValue = getEventValue(e);
        setFieldValue(name, newValue);

        if (rules.length > 0) {
            validate(newValue);
        }

        children.props.onChange?.(e);
    };

    //-------------------------------------------------
    // Blur
    //-------------------------------------------------

    const handleBlur = (e) => {
        setTouched(true);
        validate(value);
        children.props.onBlur?.(e);
    };

    const child = useMemo(() => {

        const props = {
            value,
            onChange: handleChange,
            onBlur: handleBlur
        };

        // only add invalid if there is an error
        if (errors[name]) {
            props.invalid = true;
        }

        return cloneElement(
            Children.only(children),
            props
        );

    }, [
        value,
        errors,
        children,
    ]);

    //-------------------------------------------------

    return (

        <div className={`flex flex-col gap-1 ${className}`}>

            {label && (
                <label className="font-medium">
                    {label}
                </label>
            )}
            {child}
            {errors[name] && (
                <small className="text-red-500">
                    {errors[name]}
                </small>
            )}
        </div>

    );

}