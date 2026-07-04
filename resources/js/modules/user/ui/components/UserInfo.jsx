import React, { useState } from 'react';

// Reusable Copyable Info Item Component (Pure Tailwind)
const InfoItem = ({ icon, label, value, isCopyable = false }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!isCopyable || !value || value === "—") return;
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/60 border border-slate-100 hover:bg-slate-50 transition-colors duration-200">
            <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                    <i className={`${icon} text-lg`}></i>
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-1">
                        {label}
                    </span>
                    <span className="text-sm font-semibold text-slate-700 truncate">
                        {value || "—"}
                    </span>
                </div>
            </div>

            {isCopyable && value && value !== "—" && (
                <button
                    onClick={handleCopy}
                    type="button"
                    className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 shrink-0 ${copied
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'text-slate-400 hover:bg-slate-200/60 hover:text-slate-600'
                        }`}
                    title={copied ? "Copied!" : "Copy to clipboard"}
                >
                    <i className={`pi ${copied ? 'pi-check' : 'pi-copy'} text-xs`} />
                </button>
            )}
        </div>
    );
};

// Main UserInfo Component
const UserInfo = ({ user }) => {
    if (!user) return null;

    // Helper function to safely format dates without crashing the UI
    const formatDate = (dateString, includeTime = false) => {
        if (!dateString) return null;
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return null;
            return includeTime ? date.toLocaleString() : date.toLocaleDateString();
        } catch {
            return null;
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-slate-800 antialiased">

            {/* Banner Accent Container */}
            <div className="relative h-32 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                {user.background_photo && (
                    <img
                        src={user.background_photo}
                        alt="Profile background"
                        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-300"
                    />
                )}
            </div>

            {/* Main Content Area */}
            <div className="px-6 pb-8">

                {/* Header Profile Section */}
                <div className="relative -mt-8 flex flex-col sm:flex-row sm:items-end gap-4 pb-6 border-b border-slate-100">
                    <img
                        src={user.photo || "/images/default-avatar.png"}
                        alt={user.full_name || "User Avatar"}
                        className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-sm bg-white shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 truncate">
                            {user.first_name + " " + user.last_name || "Unnamed User"}
                        </h2>
                        <p className="text-sm font-medium text-slate-400 mt-0.5">
                            @{user.username || "anonymous"}
                        </p>
                    </div>

                    {/* Badges Container */}
                    <div className="flex items-center gap-2 sm:self-center shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${user.is_active
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10"
                            : "bg-slate-100 text-slate-600 ring-1 ring-slate-500/10"
                            }`}>
                            <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${user.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {user.is_active ? "Active" : "Inactive"}
                        </span>

                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${user.is_banned
                            ? "bg-rose-50 text-rose-700 ring-1 ring-rose-600/10"
                            : "bg-blue-50 text-blue-700 ring-1 ring-blue-600/10"
                            }`}>
                            {user.is_banned ? "Banned" : "Verified Account"}
                        </span>
                    </div>
                </div>

                {/* Ban Warning Alert Box */}
                {user.is_banned && (
                    <div className="mt-6 flex gap-3.5 p-4 bg-rose-50/60 border border-rose-100 rounded-xl">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-600 shrink-0">
                            <i className="pi pi-ban text-base" />
                        </div>
                        <div className="text-sm text-rose-900/80">
                            <h4 className="font-bold text-rose-900 mb-0.5">Account Restriction Notice</h4>
                            <p className="mb-0.5">
                                <span className="font-semibold text-rose-800">Reason:</span> {user.ban_reason || "No explicit reason specified."}
                            </p>
                            {user.banned_at && (
                                <p>
                                    <span className="font-semibold text-rose-800">Date:</span> {formatDate(user.banned_at, true)}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Main Grid Content */}
                <div className="mt-6 space-y-6">

                    {/* Bio Section */}
                    {user.bio && (
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Biography</h3>
                            <p className="text-sm text-slate-600 leading-relaxed italic bg-slate-50/40 p-4 rounded-xl border border-slate-100">
                                "{user.bio}"
                            </p>
                        </div>
                    )}

                    {/* Structured Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                        {/* Left Column: Personal & Contact */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Identity Details</h3>
                                <div className="space-y-2.5">
                                    <InfoItem icon="pi pi-user" label="First Name" value={user.first_name} />
                                    <InfoItem icon="pi pi-user" label="Last Name" value={user.last_name} />
                                    <InfoItem icon="pi pi-users" label="Gender" value={user.gender || "Not specified"} />
                                    <InfoItem icon="pi pi-calendar" label="Birth Date" value={formatDate(user.birth_date)} />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Communications</h3>
                                <div className="space-y-2.5">
                                    <InfoItem icon="pi pi-envelope" label="Email" value={user.email} isCopyable />
                                    <InfoItem icon="pi pi-phone" label="Phone" value={user.phone || "No phone linked"} isCopyable={!!user.phone} />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: System & Settings */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">System Metrics</h3>
                                <div className="space-y-2.5">
                                    <InfoItem icon="pi pi-language" label="Language Profile" value={user.language?.toUpperCase()} />
                                    <InfoItem icon="pi pi-dollar" label="Base Currency" value={user.currency} />
                                    <InfoItem icon="pi pi-clock" label="Registration Date" value={formatDate(user.created_at)} />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Latest Activity</h3>
                                <div className="space-y-2.5">
                                    <InfoItem icon="pi pi-history" label="Last Login at" value={formatDate(user.last_login_at, true) || "Never logged in"} />
                                    <InfoItem icon="pi pi-map-marker" label="Network IP" value={user.last_login_ip} />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Roles Footer Section */}
                    {user.roles?.length > 0 && (
                        <div className="pt-5 border-t border-slate-100">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Assigned Security Roles</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.roles.map((role) => (
                                    <span
                                        key={role.id || role.name}
                                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-50/80 text-indigo-700 border border-indigo-100/60 shadow-sm"
                                    >
                                        {role.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default UserInfo;
