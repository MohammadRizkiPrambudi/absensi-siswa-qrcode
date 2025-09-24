import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

export default function EditModal({ show, onClose, student, classrooms }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        nisn: "",
        classroom_id: "",
        phone_number: "",
    });

    // isi form otomatis saat modal dibuka
    useEffect(() => {
        if (student) {
            setForm({
                name: student.user.name || "",
                email: student.user.email || "",
                password: "",
                nisn: student.nisn || "",
                classroom_id: student.classroom_id || "",
                phone_number: student.phone_number || "",
            });
        }
    }, [student]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(`/students/${student.id}`, form, {
            onSuccess: () => onClose(),
        });
    };

    if (!show || !student) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold">Edit Siswa</h2>
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
                    <input
                        type="text"
                        name="nisn"
                        placeholder="NISN"
                        value={form.nisn}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2"
                        required
                    />
                    <input
                        type="text"
                        name="phone_number"
                        placeholder="Phone Number"
                        value={form.phone_number}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2"
                        required
                    />
                    <select
                        name="classroom_id"
                        value={form.classroom_id}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2"
                        required
                    >
                        <option value="">Pilih kelas...</option>
                        {classrooms.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
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
