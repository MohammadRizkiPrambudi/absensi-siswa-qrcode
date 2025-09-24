import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function CreateModal({
    show,
    onClose,
    classrooms,
    teachers,
    subjects,
}) {
    const [form, setForm] = useState({
        teacher_id: "",
        subject_id: "",
        classroom_id: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post("/teacher-subject-classroom", form, {
            onSuccess: () => {
                onClose(); // tutup modal setelah sukses
                setForm({
                    teacher_id: "",
                    subject_id: "",
                    classroom_id: "",
                });
            },
        });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold">
                        Tambah Mapping Guru-Mapel-Kelas
                    </h2>
                    <button onClick={onClose} className="text-gray-500">
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                    <select
                        name="teacher_id"
                        value={form.teacher_id}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2"
                        required
                    >
                        <option value="">Pilih Guru...</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                            </option>
                        ))}
                    </select>
                    <select
                        name="subject_id"
                        value={form.subject_id}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2"
                        required
                    >
                        <option value="">Pilih Mapel...</option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
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
