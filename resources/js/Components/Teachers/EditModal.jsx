import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

export default function EditModal({ show, onClose, teacher }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    // isi form otomatis saat modal dibuka
    useEffect(() => {
        if (teacher) {
            setForm({
                name: teacher.name || "",
                email: teacher.email || "",
                password: "",
            });
        }
    }, [teacher]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(`/teachers/${teacher.id}`, form, {
            onSuccess: () => onClose(),
        });
    };

    if (!show || !teacher) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold">Edit Guru</h2>
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
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password (biarkan kosong jika tidak diubah)"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2"
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
