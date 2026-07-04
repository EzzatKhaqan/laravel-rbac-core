import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../services/apiClient";
import BaseForm from "../../../../components/form/BaseForm";

const Permission = () => {
    const toast = useRef(null);
    const queryClient = useQueryClient();

    // Consolidated Dynamic Modal Control Engine
    const [modal, setModal] = useState({
        visible: false,
        type: "", // 'create' | 'edit' | 'delete'
        id: null,
        data: null
    });

    // Local workspace for form values (Create & Edit)
    const [formData, setFormData] = useState({ subject: "", action: "" });

    // ==========================================
    // READ QUERY (Replaces manual useEffect fetch)
    // ==========================================
    const { data: permissions = [], isLoading } = useQuery({
        queryKey: ["permissions"],
        queryFn: async () => {
            const response = await apiClient.get("/auth/permissions");
            return response.data;
        }
    });

    // ==========================================
    // MUTATIONS (Handles cached invalidations automatically)
    // ==========================================

    // Create Permission Mutation
    const createMutation = useMutation({
        mutationFn: async (newData) => {
            const res = await apiClient.post("/auth/permissions", newData);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
            toast.current?.show({ severity: "success", summary: "Success", detail: "Permission created successfully" });
            closeModal();
        },
        onError: (err) => console.error(err)
    });

    // Update Permission Mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, updatedData }) => {
            const res = await apiClient.put(`/auth/permissions/${id}`, updatedData);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
            toast.current?.show({ severity: "success", summary: "Success", detail: "Permission updated successfully" });
            closeModal();
        },
        onError: (err) => console.error(err)
    });

    // Delete Permission Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await apiClient.delete(`/auth/permissions/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
            toast.current?.show({ severity: "success", summary: "Deleted", detail: "Permission deleted successfully" });
            closeModal();
        },
        onError: (err) => console.error(err)
    });

    // ==========================================
    // ACTIONS & CONTROLS
    // ==========================================
    const openCreateDialog = () => {
        setFormData({ subject: "", action: "" });
        setModal({ visible: true, type: "create", id: null, data: null });
    };

    const openEditDialog = (permission) => {
        setFormData({ subject: permission.subject, action: permission.action });
        setModal({ visible: true, type: "edit", id: permission.id, data: permission });
    };

    const openDeleteDialog = (permission) => {
        setModal({ visible: true, type: "delete", id: permission.id, data: permission });
    };

    const closeModal = () => {
        setModal({ visible: false, type: "", id: null, data: null });
        setFormData({ subject: "", action: "" });
    };

    const handleSave = (isValid) => {
        if (!isValid) return;

        if (modal.type === "create") {
            createMutation.mutate(formData);
        } else if (modal.type === "edit") {
            updateMutation.mutate({ id: modal.id, updatedData: formData });
        } else {
            deleteMutation.mutate(modal.id);
        }
    };

    // AFTER mutations
    const loading =
        createMutation.isPending ||
        updateMutation.isPending ||
        deleteMutation.isPending;

    // ==========================================
    // TEMPLATES
    // ==========================================
    const actionBodyTemplate = (rowData) => (
        <div className="flex items-center gap-3">
            <i
                className="pi pi-pencil text-sm text-blue-500 hover:text-blue-600 cursor-pointer p-1.5 hover:bg-blue-50 rounded-md transition-colors"
                title="Edit Permission"
                onClick={() => openEditDialog(rowData)}
            />
            <i
                className="pi pi-trash text-sm text-red-500 hover:text-red-600 cursor-pointer p-1.5 hover:bg-red-50  rounded-md transition-colors"
                title="Delete Permission"
                onClick={() => openDeleteDialog(rowData)}
            />
        </div>
    );

    const dialogFooter = (
        <div className="flex justify-end gap-2 mt-4">
            <Button label="Cancel" icon="pi pi-times" outlined onClick={closeModal} size="small" />
            <Button
                label={modal.type === "create" ? "Save" : "Update"}
                icon="pi pi-check"
                onClick={handleSave}
                loading={createMutation.isPending || updateMutation.isPending}
                size="small"
            />
        </div>
    );

    return (
        <div className="card">
            <div className="flex justify-between align-items-center mb-4">
                <h2>Permissions</h2>
                <Button
                    label="Create Permission"
                    icon="pi pi-plus"
                    size="small"
                    className="h-8"
                    onClick={openCreateDialog}
                />
            </div>

            <DataTable
                value={permissions}
                paginator
                loading={permissions.length === 0 && isLoading}
                rows={10}
                stripedRows
                responsiveLayout="scroll"
                emptyMessage="No permissions found."
                size="small"
            >
                <Column field="id" header="ID" style={{ width: "100px" }} />
                <Column field="name" header="Name" />
                <Column field="subject" header="Subject" />
                <Column field="action" header="Action" />
                <Column header="Actions" body={actionBodyTemplate} />
            </DataTable>

            <Dialog
                header={modal.type === 'edit' ? "Edit Permission" : modal.type === 'create' ? "Create Permission" : "Delete Permission"}
                visible={modal.visible}
                style={{ width: "30rem" }}
                onHide={() => setModal({ ...modal, visible: false })}
            >
                <BaseForm initialValues={{
                    subject: modal?.data?.subject ?? "",
                    action: modal?.data?.action ?? [],
                }}
                    onSubmit={handleSave}>

                    {
                        modal.type === "delete" && (
                            <>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-50 border border-red-100 ">
                                    {/* Warning Icon Anchor */}
                                    <div className="shrink-0 p-2 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                                        <i className="pi pi-exclamation-triangle text-xl"></i>
                                    </div>

                                    {/* Text Area */}
                                    <div className="flex-1 space-y-1">
                                        <h3 className="text-base font-semibold text-red-800">
                                            Delete Permission
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
                            </>
                        )
                    }

                    {(modal.type == "edit" || modal.type == "create") && (
                        <div>
                            <div className="field">
                                <label htmlFor="permissionName" className="block mb-2">
                                    Subject
                                </label>

                                <InputText
                                    id="permissionName"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full"
                                    placeholder="Enter Subject"
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="permissionName" className="block mb-2">
                                    Action
                                </label>

                                <InputText
                                    id="permissionName"
                                    value={formData.action}
                                    onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                                    className="w-full"
                                    placeholder="Enter Action"
                                />
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
        </div>
    );
};

export default Permission;