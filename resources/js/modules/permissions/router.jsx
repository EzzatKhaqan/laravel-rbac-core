import Module from "./module";
import Permission from "./ui/views/Permission";

const ModuleRoute = {

    path: "/permissions",
    element: <Module />,
    children: [
        {
            path: "",
            element: <Permission />,
            handle: {
                requiresAuth: true
            },
        }
    ]
};

export default ModuleRoute;