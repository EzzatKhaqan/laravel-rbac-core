const validationRules = {
    required: (value) => {
        return value !== "" && value !== null && value !== undefined
            ? true
            : "This field is required";
    },

    min: (min) => (value) => {
        if (value === "" || value === null || value === undefined) return true;

        return Number(value) >= Number(min) ? true : `Minimum value is ${min}`;
    },

    max: (max) => (value) => {
        if (value === "" || value === null || value === undefined) return true;

        return Number(value) <= Number(max) ? true : `Maximum value is ${max}`;
    },

    minLen: (min) => (value) => {
        if (!value) return true;

        return value.length >= Number(min) ? true : `Minimum length is ${min}`;
    },

    maxLen: (max) => (value) => {
        if (!value) return true;

        return value.length <= Number(max) ? true : `Maximum length is ${max}`;
    },

    numeric: (value) => {
        if (!value) return true;

        return /^\d+$/.test(value) ? true : "Only numbers are allowed";
    },

    email: (value) => {
        if (!value) return true;

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? true
            : "Invalid email";
    },
    between: (min, max) => (value) => {
        if (value === "" || value === null || value === undefined) return true;

        const number = Number(value);

        return number >= Number(min) && number <= Number(max)
            ? true
            : `Value must be between ${min} and ${max}`;
    },
};

export default validationRules;
