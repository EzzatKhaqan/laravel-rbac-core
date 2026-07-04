import { AbilityBuilder, createMongoAbility } from "@casl/ability";

export function defineAbilitiesFor(permissions = []) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    permissions.forEach((permission) => {
        if (permission.subject && permission.action) {
            can(
                permission.action.toLowerCase(),
                permission.subject.toLowerCase(),
            );
        }
    });

    return build();
}
