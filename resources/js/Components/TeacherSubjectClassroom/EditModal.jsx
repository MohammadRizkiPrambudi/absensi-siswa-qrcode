import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

export default function EditModal({
    show,
    onClose,
    data,
    classrooms,
    teachers,
    subjects,
}) {
    const [form, setForm] = useState({
        classroom_id: "",
        subject_id: "",
        teacher_id: "",
    });

    // isi form otomatis saat modal dibuka
    useEffect(() => {
        if (data) {
            setForm({
                classroom_id: data.classroom_id || "",
                subject_id: data.subject_id || "",
                teacher_id: data.teacher_id || "",
            });
        }
    }, [data]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(`/teacher-subject-classroom/${data.id}`, form, {
            onSuccess: () => onClose(),
        });
    };

    if (!show || !data) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold">
                        Edit Mapping Guru Mapel Kelas
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
                        <option value="">Pilih kelas...</option>
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
                        <option value="">Pilih kelas...</option>
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
