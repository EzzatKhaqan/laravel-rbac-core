import React from "react";
import { NavLink } from "react-router";
import { Menu } from "../../components";
import { useLayout } from "../../providers/layouts/LayoutProvider";
import logo from "../../assets/images/logo.jpeg"
import useAuthStore from "../../store/useAuthStore"
const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar } = useLayout();
    const user = useAuthStore(state => state.user)
    const menus = [
        {
            group_name: "main",
            permission: "Dashboard",
            items: [
                {
                    label: "Dashboard",
                    icon: "pi pi-chart-line",
                    to: "/dashboard",
                    permission: "Dashboard",
                },
            ],
        },
        {
            group_name: "Access Control",
            permission: "User",
            items: [
                {
                    label: "Users",
                    icon: "pi pi-users",
                    permission: "user",
                    children: [
                        {
                            label: "Users",
                            to: "/users",
                            permission: "user",
                        },
                        {
                            label: "Roles",
                            to: "/roles",
                            permission: "role",
                        },
                        {
                            label: "Permissions",
                            to: "/permissions",
                            permission: "permission",
                        },
                    ],
                },
            ],
        },
        {
            group_name: "System",
            permission: "User",
            items: [
                {
                    label: "Settings",
                    icon: "pi pi-cog",
                    to: "/settings",
                    permission: "user",
                },
            ],
        },
    ];

    return (
        <aside
            className={`
                bg-white border-r border-gray-200
                transition-all duration-300 ease-in-out
                flex flex-col h-screen
                ${isSidebarOpen ? "w-50" : "w-15"}
            `}
        >
            {/* Header / Logo */}
            <div className="relative h-15 border-b border-gray-200 flex items-center justify-center">
                <NavLink
                    to="/"
                    className="flex items-center justify-center"
                >
                    <img
                        src={logo}
                        alt="Ezzat"
                        className="w-14 h-14 rounded-full object-contain"
                    />
                </NavLink>

                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="cursor-pointer hover:scale-110 absolute -right-3 top-1/2 -translate-y-1/2 w-6 text-(--e-primary-color) h-6 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 z-50"
                >
                    <i
                        className={`pi text-[10px] ${isSidebarOpen
                            ? "pi-angle-double-left"
                            : "pi-angle-double-right"
                            }`}
                    />
                </button>
            </div>

            <Menu menus={menus} />

            {/* User */}
            <div className="border-t border-gray-200 p-3">
                <div
                    className={`flex items-center gap-3 ${!isSidebarOpen ? "justify-center" : ""
                        }`}
                >
                    <img
                        src={user?.photo || "Avatar"}
                        alt="user"
                        className="w-10 h-10 rounded-full"
                    />

                    <div
                        className={`
                            overflow-hidden transition-all duration-300
                            ${isSidebarOpen
                                ? "max-w-[150px] opacity-100"
                                : "max-w-0 opacity-0"}
                        `}
                    >
                        <h3 className="text-sm font-semibold">{user?.first_name || "User"}</h3>
                        <p className="text-xs text-gray-500">{user.roles[0]?.name || "User"}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;