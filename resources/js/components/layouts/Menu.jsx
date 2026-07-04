import React from "react";
import MenuItem from "./MenuItem";
import { useLayout } from "../../providers/layouts/LayoutProvider";

const Menu = ({ menus = [] }) => {
    const { isSidebarOpen } = useLayout();

    return (
        <nav
            className={`
                flex-1 py-4
                transition-all duration-300
                ${isSidebarOpen
                    ? "overflow-y-auto px-3"
                    : "overflow-hidden px-2"}
            `}
        >
            <div className="space-y-2">
                {menus.map((group, i) => (
                    <div key={i}>
                        {group.group_name && (
                            <div
                                className={`
                                    overflow-hidden transition-all duration-300
                                    ${isSidebarOpen
                                        ? "max-h-10 opacity-100 mb-2"
                                        : "max-h-0 opacity-0 mb-0"}
                                `}
                            >
                                <h3 className="px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                                    {group.group_name}
                                </h3>
                            </div>
                        )}

                        <div
                            className={`space-y-1 ${!isSidebarOpen
                                ? "flex flex-col items-center"
                                : ""
                                }`}
                        >
                            {group.items.map((item, index) => (
                                <MenuItem key={index} item={item} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </nav>
    );
};

export default Menu;