import { useEffect, useRef, useState } from "react";
import apiClient from "../../../../services/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";

import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { MultiSelect } from "primereact/multiselect";
import { InputSwitch } from "primereact/inputswitch";
import UserInfo from "../components/UserInfo";
import UserForm from "../components/UserForm";

const emptyUser = {
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    background_photo: "",
    password: "",
    birth_date: null,
    gender: "",
    roles: null,
};
const User = () => {
    const queryClient = useQueryClient();

    const [modal, setModal] = useState({
        visible: false,
        type: null,
        data: null,
    });

    const [form, setForm] = useState(emptyUser);
    const handleChange = (key, value) => { setForm((prev) => ({ ...prev, [key]: value, })); };


    const menuItem = useRef(null);
    const [items, setItems] = useState([]);

    // Queries
    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await apiClient.get("/users");
            return Array.isArray(res.data) ? res.data : [];
        },
    });

    const { data: roles = [] } = useQuery({
        queryKey: ["roles"],
        queryFn: async () => {
            const res = await apiClient.get("/auth/roles");
            return Array.isArray(res.data.data)
                ? res.data.data
                : [];
        },
    });

    // Mutations
    const createUserMutation = useMutation({
        mutationFn: async (formData) => {
            return apiClient.post("/users", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });

            setModal({
                visible: false,
                type: null,
                data: null,
            });

            setForm(emptyUser);
        },
    });

    const updateUserMutation = useMutation({
        mutationFn: async ({ id, formData }) => {
            return apiClient.post(`/users/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });

            setModal({
                visible: false,
                type: null,
                data: null,
            });

            setForm(emptyUser);
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (id) => {
            return apiClient.delete(`/users/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });

            setModal({
                visible: false,
                type: null,
                data: null,
            });

            setForm(emptyUser);
        },
    });

    const handleSubmit = () => {
        const formData = new FormData();

        const formattedBirthDate = form.birth_date
            ? form.birth_date.toISOString().split("T")[0]
            : "";

        formData.append("first_name", form.first_name || "");
        formData.append("last_name", form.last_name || "");
        formData.append("username", form.username || "");
        formData.append("email", form.email || "");
        formData.append("phone", form.phone || "");
        formData.append("gender", form.gender || "");
        formData.append("birth_date", formattedBirthDate);

        form.roles?.forEach((role) => {
            formData.append("roles[]", role);
        });

        // Upload new image
        if (form.photo instanceof File) {
            formData.append("photo", form.photo);
        }
        if (form.background_photo instanceof File) {
            formData.append("background_photo", form.background_photo);
        }

        // CREATE
        if (modal.type === "create") {
            formData.append("password", form.password || "");

            createUserMutation.mutate(formData);
            return;
        }

        // EDIT
        if (modal.type === "edit") {
            formData.append("is_active", form.is_active ? 1 : 0);
            formData.append("is_banned", form.is_banned ? 1 : 0);

            if (form.photo === null) {
                formData.append("remove_photo", "1");
            }
            if (form.background_photo === null) {
                formData.append("remove_background_photo", "1");
            }

            formData.append("_method", "PUT");

            updateUserMutation.mutate({
                id: form.id,
                formData,
            });
        }
    };

    const handleDelete = (id = null) => {
        deleteUserMutation.mutate(id);
    }

    // AFTER mutations
    const loading =
        createUserMutation.isPending ||
        updateUserMutation.isPending ||
        deleteUserMutation.isPending;



    const dialogConfig =
    {
        create: { icon: "pi pi-user-plus", iconBg: "bg-green-50", iconColor: "text-green-600", title: "Create User", subtitle: "Add a new user to the system.", buttonLabel: "Create User", buttonSeverity: "success" },
        edit: { icon: "pi pi-pencil", iconBg: "bg-blue-50", iconColor: "text-blue-600", title: "Edit User", subtitle: "Update user information.", buttonLabel: "Save Changes", buttonSeverity: "info" },
        delete: { icon: "pi pi-trash", iconBg: "bg-red-50", iconColor: "text-red-600", title: "Delete User", subtitle: "This action cannot be undone.", buttonLabel: "Delete User", buttonSeverity: "danger" }
    };
    const config = dialogConfig[modal.type];

    const toggleMenu = (row, event) => { setItems(getMenuItems(row)); menuItem.current.toggle(event); };

    const getMenuItems = (row) => { let temp = []; if (ability.can('view', 'user')) { temp.push({ label: "View", icon: "pi pi-eye", command: () => setModal({ visible: true, type: "info", data: row }) }); } if (ability.can('edit', 'user')) { temp.push({ label: "Edit", icon: "pi pi-pencil", command: () => { setForm({ ...row, roles: row.roles?.map(role => role.id) || [], birth_date: new Date(row.birth_date) }); setModal({ visible: true, type: "edit", data: row }); } }); } if (ability.can('delete', 'user')) { temp.push({ label: "Delete", icon: "pi pi-trash", command: () => setModal({ visible: true, type: "delete", data: row }) }); } return temp; }

    return (
        <div className="p-4">

            {/* HEADER */}
            <div className="flex justify-between align-items-center mb-4">
                <div>
                    <h2 className="m-0 text-900">User Management</h2>
                    <small className="text-500">
                        Manage all users in the system
                    </small>
                </div>

                <Button
                    label="Add User"
                    icon="pi pi-plus"
                    severity="success"
                    raised
                    size="small"
                    className="h-8"
                    onClick={() => setModal({ visible: true, type: "create", data: null })}
                />
            </div>

            <Divider />

            {/* TABLE */}
            <DataTable
                value={users}
                paginator
                loading={users.length == 0}
                rows={10}
                stripedRows
                showGridlines
                removableSort
                size="small"
                responsiveLayout="scroll"
                emptyMessage="No users found"
                pt={{
                    headerCell: { className: 'p-1.5 text-xs' },
                    bodyCell: { className: 'p-1.5 text-xs' }
                }}
            >
                <Column field="id" header="#" sortable style={{ width: "50px" }} />
                <Column header="User" body={(rowData) => (
                    <div className="flex align-items-center gap-3">
                        <Avatar
                            image={rowData.photo}
                            label={rowData.first_name?.charAt(0)?.toUpperCase()}
                            shape="circle"
                            size="large"
                            className="cursor-pointer"
                            onClick={() => setModal({ visible: true, type: "info", data: rowData })}
                        />
                        <div>
                            <div className="font-medium text-sm text-900">
                                {rowData.first_name} {rowData.last_name}
                            </div>
                            <small className="text-500">
                                @{rowData.username}
                            </small>
                        </div>
                    </div>
                )} />
                <Column field="email" header="Email" sortable />
                <Column field="phone" header="Phone" />
                <Column header="Status" body={(rowData) => (
                    <Tag
                        value={rowData.is_active ? "Active" : "Inactive"}
                        severity={rowData.is_active ? "success" : "danger"}
                    />
                )} style={{ width: "120px" }} />
                <Column
                    header="Actions"
                    body={(rowData) => (
                        <div className="flex justify-center items-center">
                            <span
                                className="pi pi-ellipsis-v cursor-pointer hover:bg-gray-100 p-1 rounded-md transition"
                                tooltip="View"
                                aria-controls="menu_item"
                                aria-haspopup
                                onClick={(event) => toggleMenu(rowData, event)}
                            />
                        </div>
                    )}
                />
            </DataTable>

            <Menu model={items} popup ref={menuItem} id="menu_item" />

            {/* CREATE, EDIT and DELETE USER DIALOG */}
            {modal.visible && (modal.type == "create" || modal.type == "edit" || modal.type == "delete") && (<Dialog
                header={
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.iconBg}`}>
                            <i className={`${config.icon} text-xl ${config.iconColor}`} />
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold">
                                {config.title}
                            </h3>

                            <p className="text-sm text-slate-500">
                                {config.subtitle}
                            </p>
                        </div>
                    </div>
                }
                visible={modal.visible}
                modal
                draggable={false}
                dismissableMask
                style={{ width: "100%", maxWidth: "650px" }}
                pt={{
                    root: { className: 'border-none rounded-xl shadow-2xl overflow-hidden' },
                    header: { className: 'border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4' },
                    content: { className: 'px-6 py-6' },
                    footer: { className: 'border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4' }
                }}
                onHide={() => {
                    setModal({ visible: false, type: null, data: null });
                    setForm(emptyUser);
                }}
                footer={
                    <div className="flex justify-end gap-3 mt-4">

                        <Button
                            label="Cancel"
                            outlined
                            severity="secondary"
                            size="small"
                            className="h-8"
                            onClick={() => {
                                setModal({ visible: false, type: null, data: null });
                                setForm(emptyUser);
                            }}
                        />

                        <Button
                            label={config.buttonLabel}
                            icon={config.icon}
                            severity={config.buttonSeverity}
                            loading={loading}
                            size="small"
                            className="h-8"
                            onClick={() => {
                                if (modal.type === "delete") {
                                    // Added optional chaining (?.) so it won't crash if data is null
                                    handleDelete(modal.data?.id);
                                } else {
                                    handleSubmit();
                                }
                            }}
                        />

                    </div>
                }

            >
                {modal.type === "delete" ? (
                    <div className="py-4">

                        <div className="flex items-center gap-4 p-5 rounded-xl border border-red-100 bg-red-50">

                            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                                <i className="pi pi-trash text-red-600 text-xl"></i>
                            </div>

                            <div>
                                <h4 className="font-semibold text-slate-900">
                                    Delete User
                                </h4>

                                <p className="text-sm text-slate-600 mt-1">
                                    Are you sure you want to delete
                                    <span className="font-semibold text-red-600">
                                        {" "}
                                        {modal.data?.full_name}
                                    </span>
                                    ?
                                </p>

                                <p className="text-xs text-slate-500 mt-2">
                                    This user will be soft deleted and can be restored later.
                                </p>
                            </div>

                        </div>

                    </div>
                ) : (
                    <UserForm form={form} modal={modal} handleChange={handleChange} roles={roles} />
                )}

            </Dialog>
            )
            }

            {/* User Info */}
            {modal.visible && modal.type === "info" && (
                <Dialog
                    header={null}
                    visible={modal.visible}
                    draggable={false}
                    dismissableMask
                    modal
                    className="overflow-hidden rounded-2xl border-none p-0 shadow-2xl"
                    style={{ width: "100%", maxWidth: "680px" }}
                    onHide={() => setModal({ visible: false, type: null, data: null })}
                >
                    <UserInfo user={modal.data} />
                </Dialog>
            )}


        </div >
    );
};

export default User;