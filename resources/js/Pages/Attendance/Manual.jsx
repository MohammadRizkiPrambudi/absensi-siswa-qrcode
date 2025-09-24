import React, { useState, useEffect } from "react";
import { useForm, Head, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

export default function Manual({ classroom, subject, students, today }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        classroom_id: classroom.id,
        subject_id: subject.id,
        date: today,
        attendances: students.map((s) => ({
            student_id: s.id,
            status: "Present", // ✅ enum valid
            note: "",
        })),
    });

    useEffect(() => {
        if (flash.success) {
            alert(flash.success); // ✅ bisa diganti toast
        }
        if (flash.error) {
            alert(flash.error);
        }
    }, [flash]);

    const handleChange = (index, field, value) => {
        const updated = [...data.attendances];
        updated[index][field] = value;
        setData("attendances", updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("attendances.store"));
    };

    return (
        <AppLayout>
            <Head title="Absensi Manual" />
            <div className="bg-gray-100 min-h-screen py-3 px-5">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
                    <div className="mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Absensi Manual - {classroom.name} ({subject.name})
                        </h2>
                    </div>

                    {/* Error tampil */}
                    {Object.keys(errors).length > 0 && (
                        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
                            {Object.values(errors).map((err, i) => (
                                <div key={i}>{err}</div>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse bg-white shadow-sm rounded-md">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-2 py-2 border">#</th>
                                        <th className="px-2 py-2 border">
                                            Nama
                                        </th>
                                        <th className="px-2 py-2 border">
                                            Status
                                        </th>
                                        <th className="px-2 py-2 border">
                                            Catatan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((s, index) => (
                                        <tr
                                            key={index}
                                            className="text-center hover:bg-gray-50"
                                        >
                                            <td className="border px-2 py-2">
                                                {index + 1}
                                            </td>
                                            <td className="border px-2 py-2 text-left">
                                                {s.user?.name}
                                            </td>
                                            <td className="border px-2 py-2">
                                                <select
                                                    value={
                                                        data.attendances[index]
                                                            .status
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            "status",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border rounded-md px-3 py-2"
                                                >
                                                    <option value="Present">
                                                        Hadir
                                                    </option>
                                                    <option value="Permit">
                                                        Izin
                                                    </option>
                                                    <option value="Sick">
                                                        Sakit
                                                    </option>
                                                    <option value="Absent">
                                                        Alpha
                                                    </option>
                                                </select>
                                            </td>
                                            <td className="border px-2 py-2">
                                                <input
                                                    type="text"
                                                    value={
                                                        data.attendances[index]
                                                            .note
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            "note",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border rounded px-2 py-2 w-full"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-5">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Simpan Absensi
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
