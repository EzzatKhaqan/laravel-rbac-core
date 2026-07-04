import Module from "./module";
import Role from "./ui/views/Role";

const ModuleRoute = {

    path: "/roles",
    element: <Module />,
    children: [
        {
            path: "",
            element: <Role />,
            handle: {
                requiresAuth: true
            },

        }
    ]
};

export default ModuleRoute;