import React, { useEffect, useMemo } from "react";
import { NavLink, useLocation } from "react-router";
import { ability } from "../../lib/abilityInstance";
import { useLayout } from "../../providers/layouts/LayoutProvider";

const MenuItem = ({ item, level = 0, parentKey = "" }) => {
    const location = useLocation();

    const {
        isSidebarOpen,
        expandedMap = {},
        setExpandedMap,
    } = useLayout();

    if (
        item.permission &&
        !ability.can("view", item.permission.toLowerCase())
    ) {
        return null;
    }

    const hasChildren = item.children?.length > 0;

    // unique key per node (CRITICAL FIX)
    const nodeKey = parentKey ? `${parentKey}/${item.label}` : item.label;

    const isExpanded = !!expandedMap[nodeKey];

    // ACTIVE STATE (fully reactive)
    const isActive = useMemo(() => {
        const path = location.pathname;

        const check = (node) => {
            if (!node) return false;

            const selfMatch = node.to
                ? path.startsWith(node.to)
                : false;

            const childMatch =
                node.children?.some((c) => check(c)) || false;

            return selfMatch || childMatch;
        };

        return check(item);
    }, [location.pathname, item]);

    const handleToggle = (e) => {
        if (!hasChildren) return;

        e.preventDefault();

        setExpandedMap((prev) => {
            const isCurrentlyExpanded = !!prev[nodeKey];

            // If closing, just turn this node off
            if (isCurrentlyExpanded) {
                return {
                    ...prev,
                    [nodeKey]: false,
                };
            }

            // If opening, close other menus at the same deep level
            const newMap = {};

            // Rebuild map: Only keep keys that are parents/ancestors of this path
            Object.keys(prev).forEach((key) => {
                if (nodeKey.startsWith(key + "/")) {
                    newMap[key] = true;
                }
            });

            // Open the clicked menu
            newMap[nodeKey] = true;

            return newMap;
        });
    };

    return (
        <div className="w-full">
            <NavLink
                to={item.to || "#"}
                onClick={handleToggle}
                className={`
                    flex items-center justify-between
                    rounded-md transition-all duration-200

                    ${isActive
                        ? "bg-indigo-50 text-(--e-secondary-color)"
                        : "text-gray-600 hover:bg-gray-50"
                    }

                    px-3 py-2
                `}
            >
                {/* LEFT SIDE */}
                <div className="flex items-center min-w-0">
                    {/* ICON FIX (no jump when missing icon) */}
                    <div className="w-5 flex justify-center">
                        {item.icon && (
                            <i
                                className={`
                                    ${item.icon}
                                    text-sm
                                    ${isActive
                                        ? "text-(--e-secondary-color)"
                                        : "text-gray-400"
                                    }
                                `}
                            />
                        )}
                    </div>

                    <span
                        className={`
                            ${isActive && "text-(--e-secondary)!"}
                            ml-2 text-xs font-medium truncate
                            ${level === 0 ? "" : "text-gray-500"}
                        `}
                    >
                        {item.label}
                    </span>
                </div>

                {/* RIGHT ICON */}
                {hasChildren && isSidebarOpen && (
                    <i
                        className={`
                        ${"text-[12px]!"}
                            pi pi-chevron-down text-[11px]
                            transition-transform duration-200
                            ${isExpanded ? "rotate-180" : ""}
                        `}
                    />
                )}
            </NavLink>

            {/* CHILDREN */}
            {hasChildren && isSidebarOpen && (
                <div
                    className="border-l border-gray-200 transition-[grid-template-rows,opacity] duration-300 ease-in-out grid"
                    style={{
                        marginLeft: `${level * 12 + 12}px`,
                        gridTemplateRows: isExpanded ? "1fr" : "0fr",
                        opacity: isExpanded ? 1 : 0,
                        pointerEvents: isExpanded ? "auto" : "none",
                    }}
                >
                    <div className="overflow-hidden">
                        <div
                            className="space-y-1 py-1 transition-transform duration-300 ease-in-out"
                            style={{
                                transform: isExpanded ? "translateY(0px)" : "translateY(-6px)",
                            }}
                        >
                            {item.children?.map((child, idx) => (
                                <MenuItem
                                    key={child.to || idx}
                                    item={child}
                                    level={level + 1}
                                    parentKey={nodeKey}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MenuItem;