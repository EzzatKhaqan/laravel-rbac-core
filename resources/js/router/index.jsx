import { createBrowserRouter } from "react-router";
import modules from "../register-modules";
import App from "../App";
import RouteGuard from "../hooks/RouteGuard";
const router = createBrowserRouter([
    {
        element: <RouteGuard />,
        children: [
            {
                path: "",
                element: <App />,
                children: [
                    ...modules
                ]
            }
        ]
    }
]);

export default router;