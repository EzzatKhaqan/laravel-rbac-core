import { NavLink, Outlet } from "react-router-dom";

const DefaultLayout = () => {
    // Shared active state class generator for scannable, clean styles
    const navLinkClass = ({ isActive }) =>
        `text-sm font-semibold tracking-wide transition-all duration-200 relative py-2 ${isActive
            ? "text-[#24b43c] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#24b43c] after:rounded-full"
            : "text-[#002855]/70 hover:text-[#002855]"
        }`;

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#002855] font-sans">
            {/* Modern Navbar */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-2 transform transition hover:scale-[1.02]">
                        <h1 className="text-2xl font-extrabold tracking-tight">
                            <span className="text-[#24b43c]">Ezzat </span>
                            <span className="text-[#002855]">Khaqan</span>
                        </h1>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex items-center gap-8">
                        <NavLink to="/" className={navLinkClass}>Home</NavLink>
                        <NavLink to="/products" className={navLinkClass}>Products</NavLink>
                        <NavLink to="/about" className={navLinkClass}>About</NavLink>
                        <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>

                        {/* Styled Login Button Action */}
                        <NavLink
                            to="/auth/login"
                            className={({ isActive }) =>
                                `text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md ${isActive
                                    ? "bg-[#002855] text-white shadow-[#002855]/10"
                                    : "bg-[#24b43c] text-white hover:bg-[#1f9c33] active:scale-[0.98] shadow-[#24b43c]/10"
                                }`
                            }
                        >
                            Login
                        </NavLink>
                    </nav>
                </div>
            </header>

            {/* Page Content Viewport */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 animate-fadein">
                <Outlet />
            </main>

            {/* Minimalist Corporate Footer */}
            <footer className="bg-white border-t border-gray-100">
                <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-xs font-medium text-[#002855]/60 gap-4">
                    <div>
                        © {new Date().getFullYear()} <span className="font-bold text-[#002855]"><span className="text-(--e-primary-color)">Ezzat</span></span>. All rights reserved.
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#privacy" className="hover:text-[#24b43c] transition-colors">Privacy Policy</a>
                        <a href="#terms" className="hover:text-[#24b43c] transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default DefaultLayout;
