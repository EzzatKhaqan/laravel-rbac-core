import Module from "./Module"
import Dashboard from "./ui/views/Dashboard"

const ModuleRoute = {
    path: "/dashboard",
    element: <Module />,
    children: [
        {
            path: "",
            element: <Dashboard />,
            handle: {
                requiresAuth: true
            }
        }
    ]
}

export default ModuleRoute