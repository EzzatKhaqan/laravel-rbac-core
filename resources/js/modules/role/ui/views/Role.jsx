import React, { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Accordion, AccordionTab } from "primereact/accordion";
import apiClient from "../../../../services/apiClient";
import BaseForm from "../../../../components/form/BaseForm";
import BaseField from "../../../../components/form/BaseField";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Role = () => {
    const toast = useRef(null);
    const queryClient = useQueryClient();

    // Dialog & Form States
    const [roleName, setRoleName] = useState("");
    const [modal = null, setModal] = useState({
        visible: false,
        data: {},
        type: "",
        id: null
    });
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [permissionDialog, setPermissionDialog] = useState(false);
    const [currentPermissions, setCurrentPermissions] = useState([]);

    // ==========================================
    // READ QUERIES (Replaces useEffect fetches)
    // ==========================================
    const { data: roles = [] } = useQuery({
        queryKey: ["roles"],
        queryFn: async () => {
            const res = await apiClient.get("/auth/roles");
            return res.data.data;
        },
    });

    const { data: permissions = [] } = useQuery({
        queryKey: ["permissions"],
        queryFn: async () => {
            const res = await apiClient.get("/auth/permissions");
            return res.data;
        },
    });

    // ==========================================
    // MUTATIONS (Replaces API action triggers)
    // ==========================================

    // Create Role Mutation
    const storeRoleMutation = useMutation({
        mutationFn: async (newRole) => {
            const res = await apiClient.post("/auth/roles", newRole);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Role created successfully",
            });
            resetForm();
        },
        onError: (error) => {
            console.error(error);
        },
    });

    // Update Role Mutation
    const updateRoleMutation = useMutation({
        mutationFn: async ({ id, updatedData }) => {
            const res = await apiClient.put(`/auth/roles/${id}`, updatedData);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Role updated successfully",
            });
            resetForm();
        },
        onError: (error) => {
            console.error(error);
        },
    });

    // Delete Role Mutation

    const deleteRoleMutation = useMutation({
        mutationFn: async (id) => {
            await apiClient.delete(`/auth/roles/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            toast.current.show({
                severity: "success",
                summary: "Deleted",
                detail: "Role deleted successfully",
            });
            resetForm();
        },
        onError: (error) => {
            console.error(error);
        },
    });

    // ==========================================
    // EVENT HANDLERS & HELPERS
    // ==========================================
    const handleSaveRole = (isValid) => {
        if (!isValid) return;

        if (modal?.type === "edit") {
            updateRole();
        } else if (modal.type == 'create') {
            storeRole();
        } else {
            deleteRoleMutation.mutate(modal.id);
        }
    };

    const storeRole = () => {
        const payload = {
            name: roleName,
            permissions: selectedPermissions.map((p) => p.id),
        };
        storeRoleMutation.mutate(payload);
    };

    const updateRole = () => {
        const payload = {
            id: modal.id,
            updatedData: {
                name: roleName,
                permissions: selectedPermissions.map((p) => p.id),
            },
        };
        updateRoleMutation.mutate(payload);
    };

    const resetForm = () => {
        setRoleName("");
        setSelectedPermissions([]);
        setModal({ visible: false, data: {}, type: "", id: null });
    };

    // AFTER mutations
    const loading =
        storeRoleMutation.isPending ||
        updateRoleMutation.isPending ||
        deleteRoleMutation.isPending;

    const openCreateDialog = () => {
        resetForm();
        setModal({ visible: true, data: {}, type: "create" });
    };

    const openEditDialog = (role) => {
        setModal({ visible: true, data: role, type: "edit", id: role.id });

        setRoleName(role.name);

        const freshPermissions = queryClient.getQueryData(["permissions"]) || [];

        const selected = freshPermissions.filter(permission =>
            role.permissions?.some(rp => Number(rp.id) === Number(permission.id))
        );

        setSelectedPermissions(selected);
    };

    // ============================== templates ===========================
    const actionBodyTemplate = (rowData) => (
        <div className="flex items-center gap-3">
            {/* Edit Icon Link */}
            <i
                className="pi pi-pencil text-sm text-blue-500 hover:text-blue-600 cursor-pointer p-1.5 hover:bg-blue-50 rounded-md transition-colors"
                title="Edit Role"
                onClick={() => openEditDialog(rowData)}
            />

            {/* Delete Icon Link */}
            <i
                className="pi pi-trash text-sm text-red-500 hover:text-red-600 cursor-pointer p-1.5 hover:bg-red-50 rounded-md transition-colors"
                title="Delete Role"
                onClick={() => setModal({ visible: true, data: rowData, type: "delete", id: rowData.id })}
            />
        </div>
    );


    const headerTemplate = (data) => {
        return (
            <span className="font-bold text-primary">
                {data.subject.toUpperCase()}
            </span>
        );
    };

    const permissionsBodyTemplate = (rowData) => {
        const perms = rowData.permissions || [];
        const preview = perms.slice(0, 3);

        return (
            <div className="flex align-items-center gap-2 flex-wrap">
                {preview.map((p) => (
                    <span
                        key={p.id}
                        className="px-2 py-1 border-round bg-primary text-black text-xs"
                    >
                        {p.name}
                    </span>
                ))}

                {perms.length > 3 && (
                    <Button
                        size="small"
                        link
                        label={`+${perms.length - 3} more`}
                        onClick={() => {
                            setCurrentPermissions(perms);
                            setPermissionDialog(true);
                        }}
                    />
                )}
            </div>
        );
    };
    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="card">

                <div className="flex justify-between align-items-center mb-4">
                    <h2 className="m-0">Roles</h2>

                    <Button
                        label="Create Role"
                        icon="pi pi-plus"
                        onClick={openCreateDialog}
                        size="small"
                        className="h-8"
                    />
                </div>

                <DataTable
                    value={roles}
                    loading={roles.length === 0}
                    dataKey="id"
                    paginator
                    rows={10}
                    stripedRows
                    responsiveLayout="scroll"
                    size="small"
                >
                    <Column
                        field="id"
                        header="#"
                        style={{ width: "80px" }}
                    />

                    <Column
                        field="name"
                        header="Role Name"
                    />

                    <Column
                        header="Permissions"
                        body={permissionsBodyTemplate}
                    />

                    <Column
                        header="Actions"
                        body={actionBodyTemplate}
                        style={{ width: "150px" }}
                    />
                </DataTable>

                {/* Role's Permissions Details */}
                <Dialog
                    header="Role Permissions"
                    visible={permissionDialog}
                    style={{ width: "40rem" }}
                    onHide={() => setPermissionDialog(false)}

                >
                    <div>
                        <DataTable
                            value={currentPermissions}
                            dataKey="id"
                            size="small"
                            rowGroupMode="subheader"
                            groupRowsBy="subject"
                            sortMode="single"
                            sortField="subject"
                            sortOrder={1}
                            scrollable
                            scrollHeight="350px"
                            rowHover
                            globalFilter={globalFilter}
                            globalFilterFields={['subject', 'action', 'name']}
                            rowGroupHeaderTemplate={headerTemplate}
                            header={<>
                                <>
                                    <div className="flex justify-between align-items-center">
                                        <h3 className="m-0">Permissions</h3>

                                        <span className="p-input-icon-left">
                                            <i className="pi pi-search" />
                                            <InputText
                                                value={globalFilter}
                                                onChange={(e) => setGlobalFilter(e.target.value)}
                                                placeholder="Search permission..."
                                                className="h-8"
                                                size="small"
                                            />
                                        </span>
                                    </div></>
                            </>}

                        >
                            <Column
                                field=""
                                header="Subject"
                            />
                            <Column
                                field="action"
                                header="Action"
                            />
                        </DataTable>
                    </div>
                </Dialog>

                {/* Create, Edit and Delete */}
                <Dialog
                    header={modal.type === 'edit' ? "Edit Role" : modal.type === 'create' ? "Create Role" : "Delete Role"}
                    visible={modal.visible}
                    style={{ width: "45rem" }}
                    onHide={() => setModal({ ...modal, visible: false })}
                    maximizable
                >
                    <BaseForm
                        initialValues={{
                            role_name: modal?.data?.name ?? "",
                            permissions: modal?.data?.permissions ?? [],
                        }}
                        onSubmit={handleSaveRole}
                    >
                        {(modal.type == 'create' || modal.type == 'edit') &&
                            <>
                                <div className="flex flex-col gap-4 overflow-hidden">

                                    <BaseField
                                        name="role_name"
                                        label="Role Name"
                                        rules={[
                                            "required"
                                        ]}
                                    >
                                        <InputText
                                            className="w-full h-8"
                                            placeholder="Enter role name"
                                            size="small"
                                            onChange={(e) => setRoleName(e.target.value)}
                                        />
                                    </BaseField>

                                    <DataTable
                                        value={permissions}
                                        dataKey="id"
                                        size="small"
                                        rowGroupMode="subheader"
                                        groupRowsBy="subject"
                                        sortMode="single"
                                        sortField="subject"
                                        sortOrder={1}
                                        selectionMode="multiple"
                                        scrollable
                                        scrollHeight="60vh"
                                        globalFilter={globalFilter}
                                        selection={selectedPermissions}
                                        onSelectionChange={(e) => setSelectedPermissions(e.value)}
                                        globalFilterFields={[
                                            "subject",
                                            "action",
                                            "name",
                                        ]}
                                        rowGroupHeaderTemplate={headerTemplate}
                                        header={
                                            <>
                                                <div className="flex justify-between items-center">
                                                    <h3 className="m-0">Permissions</h3>

                                                    {/* Modern PrimeReact Icon Container */}
                                                    <IconField iconPosition="left">
                                                        <InputIcon className="pi pi-search" />
                                                        <InputText
                                                            value={globalFilter}
                                                            onChange={(e) => setGlobalFilter(e.target.value)}
                                                            placeholder="Search permission..."
                                                            className="h-8"
                                                            size="small"
                                                        />
                                                    </IconField>
                                                </div>

                                            </>
                                        }
                                    >
                                        <Column
                                            selectionMode="multiple"
                                            headerStyle={{ width: "3rem" }}
                                        />

                                        <Column
                                            field="subject"
                                            header="Subject"
                                        />

                                        <Column
                                            field="action"
                                            header="Action"
                                        />
                                    </DataTable>

                                </div>
                            </>
                        }
                        {modal.type === 'delete' && (
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-red-50 border border-red-100 ">
                                {/* Warning Icon Anchor */}
                                <div className="shrink-0 p-2 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                                    <i className="pi pi-exclamation-triangle text-xl"></i>
                                </div>

                                {/* Text Area */}
                                <div className="flex-1 space-y-1">
                                    <h3 className="text-base font-semibold text-red-800 dark:text-red-400">
                                        Delete Role
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Are you sure you want to delete the role
                                        <strong className="font-semibold text-gray-900 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                                            {modal?.data?.name}
                                        </strong>?
                                        This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex mt-4 justify-end gap-2">
                            <Button
                                label="Cancel"
                                severity="secondary"
                                outlined
                                type="button"
                                onClick={() => setModal({ ...modal, visible: false })}
                                size="small"
                                className="h-8"
                            />

                            <Button
                                label={modal.type === 'edit' ? "Update" : modal.type === 'create' ? "Create" : "Delete"}
                                icon="pi pi-check"
                                size="small"
                                className="h-8"
                                loading={loading}
                                type="submit"
                            />
                        </div>
                    </BaseForm>
                </Dialog>
            </div >
        </>
    );
};

export default Role;