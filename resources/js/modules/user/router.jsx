import Module from "./Module";
import User from "./ui/views/User";

const moduleRoute = {
    path: "/users",
    element: <Module />,
    children: [
        {
            path: "",
            element: <User />,
            handle: {
                requiresAuth: true,
                permissions: ["User"]
            }
        }
    ]
};

export default moduleRoute;