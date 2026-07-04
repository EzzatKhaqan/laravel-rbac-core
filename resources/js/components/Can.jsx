import { useAbility } from "@/providers/AbilityProvider";

export const Can = ({ I, a, children, not }) => {
    const ability = useAbility();

    I = I.toLowerCase();
    a = a.toLowerCase();

    const allowed = not
        ? !ability.can(I, a)
        : ability.can(I, a);

    return allowed ? children : null;
};