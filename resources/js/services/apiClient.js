import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(import.meta.env.VITE_TOKEN_KEY);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const status = error.response?.status;

        switch (status) {
            case 401:
                localStorage.removeItem(import.meta.env.VITE_TOKEN_KEY);
                localStorage.removeItem(import.meta.env.VITE_TOKEN_KEY);

                // window.location.href = "/auth/login";
                break;

            case 403:
                console.error("Forbidden");
                break;

            case 404:
                console.error("Resource not found");
                break;

            case 422:
                return Promise.reject(error.response.data);

            case 500:
                console.error("Internal server error");
                break;

            default:
                console.error(error);
        }

        return Promise.reject(error);
    },
);

export default apiClient;
