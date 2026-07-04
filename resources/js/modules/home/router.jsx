

import Module from "./Module"
import Home from "./ui/views/Home"

const ModuleRoute = {
    path: "",
    element: <Module />,
    children: [
        {
            path: "",
            element: <Home />,
            handle: {
                requireAuth: false
            }
        }
    ]
}

export default ModuleRoute