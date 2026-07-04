// parseRules.js

import { validationRules } from "./index";

const parseRules = (rules = []) => {
    // allow string too
    if (typeof rules === "string") {
        rules = rules.split("|");
    }

    return rules
        .map((rule) => {
            let ruleName = rule;
            let params = [];

            /*
                examples:

                "required"

                "minLen:2"

                "between:5,10"
            */

            if (typeof rule === "string" && rule.includes(":")) {
                const parts = rule.split(":");

                ruleName = parts[0];

                params = parts[1] ? parts[1].split(",") : [];
            }

            const validator = validationRules[ruleName];

            if (!validator) {
                console.warn(`Validation rule "${ruleName}" does not exist`);

                return null;
            }

            return (value, values) => {
                let result;

                if (params.length) {
                    result = validator(...params)(value, values);
                } else {
                    result = validator(value, values);
                }

                return result;
            };
        })
        .filter(Boolean);
};

export default parseRules;
