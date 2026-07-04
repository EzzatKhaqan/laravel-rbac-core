import Module from "./Module"
import Login from "./ui/views/Login"

const ModuleRoute = {
    path: "/auth",
    element: <Module />,
    children: [
        {
            path: "login",
            element: <Login />
        }
    ]
}

export default ModuleRoute