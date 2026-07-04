import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { useState } from "react";


const UserForm = ({ modal, form, handleChange, roles }) => {
    // AFTER roles query
    const roleOptions = roles.map((role) => ({
        label: role.name,
        value: role.id,
    }));

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">

                <div className="md:col-span-2 flex items-center gap-5 p-4 bg-slate-50 border border-slate-100 rounded-xl mb-2">
                    <div className="w-full space-y-4">
                        {/* Combined Header Photo Upload Canvas */}
                        <div className="relative w-full h-44 rounded-2xl bg-slate-100 border border-slate-200 overflow-visible group/banner">

                            {/* 1. Background Cover Photo Layer */}
                            {form.background_photo ? (

                                <img
                                    src={typeof form.background_photo === 'string' ? form.background_photo : URL.createObjectURL(form.background_photo)}
                                    alt="Cover background"
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            ) : (
                                <div className="w-full h-full rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 gap-1.5">
                                    <i className="pi pi-images text-2xl" />
                                    <span className="text-xs font-medium">Add cover photo</span>
                                </div>
                            )}

                            {/* Background Upload & Remove Hover Overlays */}
                            <div className="absolute inset-0 bg-slate-900/40 rounded-2xl flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity duration-200 z-20">
                                <label
                                    htmlFor="background-upload"
                                    className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/30 text-white text-xs font-semibold shadow-sm hover:bg-white/30 transition-all cursor-pointer"
                                >
                                    <i className="pi pi-camera text-sm" />
                                    <span>Change Cover</span>
                                </label>

                                {form.background_photo && (
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 bg-rose-600/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-rose-500/30 text-white text-xs font-semibold shadow-sm hover:bg-rose-600 transition-all cursor-pointer"
                                        onClick={() => handleChange("background_photo", null)}
                                    >
                                        <i className="pi pi-trash text-sm" />
                                        <span>Remove</span>
                                    </button>
                                )}
                            </div>
                            <input
                                type="file"
                                id="background-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        handleChange("background_photo", e.target.files[0]);
                                    }
                                }}
                            />

                            {/* 2. Layered Avatar Upload (Single Instance) */}
                            <div className="absolute -bottom-8 left-6 group/avatar w-24 h-24 flex-shrink-0 z-30">
                                {form.photo ? (
                                    <img
                                        src={typeof form.photo === 'string' ? form.photo : URL.createObjectURL(form.photo)}
                                        alt="Avatar Preview"
                                        className="w-full h-full object-cover rounded-2xl ring-4 ring-white shadow-md bg-white"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 ring-4 ring-white shadow-sm rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200">
                                        <i className="pi pi-user text-3xl"></i>
                                    </div>
                                )}

                                {/* Avatar Upload & Remove Hover Overlays */}
                                <div className="absolute inset-0 bg-slate-900/50 rounded-2xl flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 shadow-inner">
                                    <label
                                        htmlFor="photo-upload"
                                        className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/30 transition-all cursor-pointer text-white"
                                        title="Change Avatar"
                                    >
                                        <i className="pi pi-camera text-xs"></i>
                                    </label>

                                    {form.photo && (
                                        <button
                                            type="button"
                                            className="p-1.5 bg-rose-600/80 backdrop-blur-sm rounded-lg border border-rose-500/20 hover:bg-rose-600 transition-all cursor-pointer text-white"
                                            title="Remove Avatar"
                                            onClick={() => handleChange("photo", null)}
                                        >
                                            <i className="pi pi-trash text-xs"></i>
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="photo-upload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleChange("photo", e.target.files[0]);
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Extra padding helper to push content below the absolute avatar wrapper */}
                        <div className="h-6" />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider">First Name</label>
                    <InputText
                        className="w-full h-10 px-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                        value={form.first_name}
                        placeholder="Name"
                        onChange={(e) => handleChange("first_name", e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider">Last Name</label>
                    <InputText
                        className="w-full h-10 px-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                        value={form.last_name}
                        onChange={(e) => handleChange("last_name", e.target.value)}
                        placeholder="Last Name"
                    />
                </div>

                <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider">Username</label>
                    <InputText
                        className="w-full h-10 px-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                        value={form.username}
                        onChange={(e) => handleChange("username", e.target.value)}
                        placeholder="Username"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider">Email Address</label>
                    <InputText
                        className="w-full h-10 px-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="Email"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider">Phone Number</label>
                    <InputText
                        className="w-full h-10 px-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="Phone Number"
                    />
                </div>

                {modal.type == 'create' && <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider">Password</label>
                    <InputText
                        type="password"
                        className="w-full h-10 px-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                        value={form.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        placeholder="Password"
                    />
                </div>}
                {modal.type == 'edit' && (
                    <>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider">Status</label>

                            <InputSwitch checked={form.is_active} onChange={(e) => handleChange("is_active", e.value)} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider">Is Banned</label>

                            <InputSwitch checked={form.is_banned} onChange={(e) => handleChange("is_banned", e.value)} />
                        </div>
                    </>
                )}

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider">Birth Date</label>

                        <Calendar
                            className="w-full overflow-hidden"
                            inputClassName="h-10 border border-slate-200 rounded-lg"
                            value={form.birth_date}
                            placeholder="Select birth date"
                            onChange={(e) => handleChange("birth_date", e.value)}
                            dateFormat="yy-mm-dd"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider">Gender</label>
                        <Dropdown
                            className="w-full h-10 overflow-hidden flex items-center"
                            value={form.gender}
                            options={[
                                { label: "Male", value: "male" },
                                { label: "Female", value: "female" },
                            ]}
                            placeholder="Select"
                            onChange={(e) => handleChange("gender", e.value)}
                            display="chip"
                        />
                    </div>

                </div>

                <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider">
                        Roles
                    </label>

                    <MultiSelect
                        value={form.roles}
                        options={roleOptions}
                        onChange={(e) => handleChange("roles", e.value)}
                        placeholder="Select roles"
                        display="chip"
                        className="w-full h-10 border border-slate-200 rounded-lg flex items-center"
                    />
                </div>

            </div>
        </>
    )
}

export default UserForm;