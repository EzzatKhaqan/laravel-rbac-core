import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// PrimeReact UI Components
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // Clear specific validation error field immediately upon user re-typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    // Robust client-side validation logic
    const validateForm = () => {
        let tempErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!form.email.trim()) {
            tempErrors.email = "Email field cannot be left blank.";
        } else if (!emailRegex.test(form.email)) {
            tempErrors.email = "Please enter a valid email address.";
        }

        if (!form.password) {
            tempErrors.password = "Password field cannot be left blank.";
        } else if (form.password.length < 6) {
            tempErrors.password = "Password must consist of at least 6 characters.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Run local validations first before firing network requests
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});
        setMessage("");

        try {
            const result = await login(form);
            if (result.success) {
                navigate("/dashboard");
            } else {
                setMessage("Invalid credentials");
            }
        } catch (error) {
            if (error.response?.status === 422) {
                // Safely extract backend validation strings
                const backendErrors = error.response.data.errors || {};
                const normalizedErrors = {};
                Object.keys(backendErrors).forEach(key => {
                    normalizedErrors[key] = Array.isArray(backendErrors[key])
                        ? backendErrors[key][0]
                        : backendErrors[key];
                });
                setErrors(normalizedErrors);
            } else {
                setMessage(error.response?.data?.message || "Login failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 bg-gray-50 font-sans">

            {/* Login Card */}
            <div className="w-full max-w-md bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">

                {/* Brand Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#002855]">
                        Welcome Back
                    </h1>
                    <p className="text-gray-400 text-sm mt-2 font-medium">
                        Please sign in to your account
                    </p>
                </div>

                {/* Global Error Alert Banner */}
                {message && (
                    <div className="mb-6 animate-fadein">
                        <Message severity="error" text={message} className="w-full justify-content-start rounded-xl" />
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Input */}
                    <div className="flex flex-col">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#002855] mb-2">
                            Email Address
                        </label>
                        <InputText
                            type="email"
                            name="email"
                            size="small"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="name@company.com"
                            className={`p-3 h-10 rounded-xl border w-full text-gray-900 placeholder:text-gray-300 transition-all ${errors.email ? "p-invalid border-red-400" : "border-gray-200"
                                }`}
                        />
                        {errors.email && (
                            <small className="p-error text-xs mt-1.5 font-medium flex items-center gap-1">
                                <span>•</span> {errors.email}
                            </small>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#002855]">
                                Password
                            </label>
                            <a href="#forgot" className="text-xs font-semibold text-[#24b43c] hover:text-[#1f9c33] transition-colors">
                                Forgot password?
                            </a>
                        </div>
                        <span className="w-full p-fluid">
                            <Password
                                size="small"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                toggleMask
                                feedback={false}
                                inputClassName={`p-3 h-10 rounded-xl border w-full text-gray-900 placeholder:text-gray-300 transition-all ${errors.password ? "p-invalid border-red-400" : "border-gray-200"
                                    }`}
                            />
                        </span>
                        {errors.password && (
                            <small className="p-error text-xs mt-1.5 font-medium flex items-center gap-1">
                                <span>•</span> {errors.password}
                            </small>
                        )}
                    </div>

                    {/* PrimeReact Submit Button */}
                    <Button
                        type="submit"
                        label={loading ? "Signing in..." : "Sign In"}
                        loading={loading}
                        size="small"
                        className="w-full h-10 mt-2 p-button-custom text-white font-semibold py-3.5 rounded-xl shadow-md shadow-[#24b43c]/10 transition-all duration-200"
                    />
                </form>
            </div>
        </div>
    );
};

export default Login;
