import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function CreateModal({ show, onClose, permissions }) {
    const [form, setForm] = useState({
        name: "",
        selectedPermissions: [],
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToSubmit = {
            name: form.name,
            permissions: form.selectedPermissions,
        };

        router.post("/roles", dataToSubmit, {
            onSuccess: () => {
                onClose(); // tutup modal setelah sukses
                setForm({
                    name: "",
                    selectedPermissions: [],
                });
            },
        });
    };

    console.log(permissions);

    if (!show) return null;

    const handlePermissionChange = (e) => {
        const permissionId = parseInt(e.target.value);
        const isChecked = e.target.checked;

        setForm((prevForm) => {
            if (isChecked) {
                // Tambahkan ID ke array jika dicentang
                return {
                    ...prevForm,
                    selectedPermissions: [
                        ...prevForm.selectedPermissions,
                        permissionId,
                    ],
                };
            } else {
                // Hapus ID dari array jika tidak dicentang
                return {
                    ...prevForm,
                    selectedPermissions: prevForm.selectedPermissions.filter(
                        (id) => id !== permissionId
                    ),
                };
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold">Tambah Peran Penguna</h2>
                    <button onClick={onClose} className="text-gray-500">
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nama Peran"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2"
                        required
                    />

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Perizinan:
                        </label>
                        <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-2 border rounded-md">
                            {permissions.map((permission) => (
                                <div
                                    key={permission.id}
                                    className="flex items-center"
                                >
                                    <input
                                        id={`permission-${permission.id}`}
                                        type="checkbox"
                                        value={permission.id}
                                        onChange={handlePermissionChange}
                                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <label
                                        htmlFor={`permission-${permission.id}`}
                                        className="ml-2 text-sm text-gray-700"
                                    >
                                        {permission.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded-md"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-md"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
