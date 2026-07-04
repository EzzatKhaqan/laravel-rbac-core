import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "primereact/menu";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import useAuth from "../../modules/auth/ui/hooks/useAuth";
import useAuthStore from "@/store/useAuthStore";

const Navbar = () => {
    const navigate = useNavigate();
    const { logout, loading } = useAuth();
    const menuRef = useRef(null);

    // State to control the visibility of the custom dialog
    const [visible, setVisible] = useState(false);

    const user = useAuthStore((state) => state.user);

    const handleLogout = async () => {
        await logout();
        setVisible(false); // Close dialog on success
    };

    // Define menu items
    const menuItems = [
        {
            label: "Profile",
            icon: "pi pi-user",
            command: () => navigate("/profile")
        },
        {
            label: "Settings",
            icon: "pi pi-cog",
            command: () => navigate("/settings")
        },
        {
            separator: true
        },
        {
            label: "Logout",
            icon: "pi pi-sign-out",
            className: "text-red-500",
            command: () => setVisible(true)
        }
    ];

    return (
        <>
            {/* Custom High-Quality UI/UX Logout Modal */}
            <Dialog
                header="Logout Confirmation"
                visible={visible}
                onHide={() => !loading?.logout && setVisible(false)} // Blocks modal closing while logging out
                footer={() => (
                    <div className="flex justify-end gap-2 bg-gray-50 border-t border-gray-100 p-3">
                        <Button
                            label="Cancel"
                            size="small"
                            onClick={() => setVisible(false)}
                            disabled={loading?.logout}
                            className="h-8 p-button-text text-gray-600 hover:bg-gray-100 px-4 py-2 text-sm font-medium rounded-md transition"
                        />
                        <Button
                            label="Log Out"
                            icon="pi pi-sign-out"
                            onClick={handleLogout}
                            loading={loading?.logout} // 🔥 Dynamic spinner works perfectly here
                            size="small"
                            className="h-8 bg-red-500! border-red-500! hover:bg-red-600! px-4 py-2 text-sm text-white font-medium rounded-md transition"
                        />
                    </div>
                )}
                draggable={false}
                resizable={false}
                closable={!loading?.logout} // Hides top 'X' close button during logout execution
                className="max-w-md w-full mx-2 shadow-xl border-0 rounded-xl overflow-hidden"
                pt={{
                    header: { className: 'bg-white border-b border-gray-100 p-4! font-semibold text-gray-800' },
                    content: { className: 'p-5 text-gray-600 bg-white flex items-center gap-4' },
                    footer: { className: 'pb-4!' }
                }}
            >
                <div className="flex items-center gap-4">
                    <i className="pi pi-exclamation-triangle text-red-500 text-3xl!"></i>
                    <p className="text-sm leading-relaxed text-gray-600">
                        Are you sure you want to log out of your account? You will need to log back in to access your dashboard.
                    </p>
                </div>
            </Dialog>

            <header className="h-15 bg-white border-b border-gray-200 px-6 flex items-center justify-between">

                {/* Search */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-2 w-96">
                    <i className="pi pi-search"></i>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent outline-none px-2 w-full text-sm"
                    />
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">

                    {/* Notification */}
                    <button className="relative p-2 rounded-xl hover:bg-gray-100">
                        <i className="pi pi-bell"></i>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    <Menu model={menuItems} popup ref={menuRef} id="popup_menu" />

                    <div
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition"
                        onClick={(e) => menuRef.current?.toggle(e)}
                        aria-controls="popup_menu"
                        aria-haspopup
                    >
                        <img
                            src={user?.photo}
                            alt="user"
                            className="w-10 h-10 rounded-full object-cover"
                        />

                        <div className="hidden md:block">
                            <h4 className="text-sm font-semibold text-gray-800 leading-tight">
                                {user?.first_name || "User"}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {user?.roles?.[0]?.name || "User"}
                            </p>
                        </div>

                        <i className="pi pi-chevron-down text-md! text-gray-400 hidden sm:block ml-1"></i>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;
