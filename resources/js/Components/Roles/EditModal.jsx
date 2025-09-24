import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

export default function EditModal({ show, onClose, role, permissions }) {
    const [form, setForm] = useState({
        name: "",
        permissions: [],
    });

    // Isi form otomatis saat modal dibuka
    useEffect(() => {
        if (role) {
            setForm({
                name: role.name || "",
                // Perbaiki: Pastikan ID adalah angka saat inisialisasi
                permissions: role.permissions.map((p) => parseInt(p.id)),
            });
        }
    }, [role]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePermissionChange = (e) => {
        // Ambil ID sebagai integer karena id di backend juga integer
        const permissionId = parseInt(e.target.value);
        const isChecked = e.target.checked;

        setForm((prevForm) => {
            if (isChecked) {
                return {
                    ...prevForm,
                    permissions: [...prevForm.permissions, permissionId],
                };
            } else {
                return {
                    ...prevForm,
                    permissions: prevForm.permissions.filter(
                        (id) => id !== permissionId
                    ),
                };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Solusi: Buat objek baru untuk memastikan data dikirim dengan format yang benar
        const dataToSubmit = {
            name: form.name,
            permissions: form.permissions.map((id) => parseInt(id)),
        };

        router.put(`/roles/${role.id}`, dataToSubmit, {
            onSuccess: () => onClose(),
        });
    };

    if (!show || !role) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold">Edit Peran Pengguna</h2>
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
                            {permissions.map((p) => (
                                <div key={p.id} className="flex items-center">
                                    <input
                                        id={`permission-${p.id}`}
                                        type="checkbox"
                                        value={p.id}
                                        onChange={handlePermissionChange}
                                        checked={form.permissions.includes(
                                            p.id
                                        )}
                                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <label
                                        htmlFor={`permission-${p.id}`}
                                        className="ml-2 text-sm text-gray-700"
                                    >
                                        {p.name}
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
                            className="px-4 py-2 bg-yellow-600 text-white rounded-md"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
