import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function CreateModal({ show, onClose }) {
    const [form, setForm] = useState({
        name: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post("/permissions", form, {
            onSuccess: () => {
                onClose(); // tutup modal setelah sukses
                setForm({
                    name: "",
                });
            },
        });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold">Tambah Hak Akses</h2>
                    <button onClick={onClose} className="text-gray-500">
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nama"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2"
                        required
                    />

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
