import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { FaFilePdf } from "react-icons/fa";

export default function Report() {
    const { attendances, filters, classrooms, subjects } = usePage().props;
    const { get } = useForm(filters);

    return (
        <AppLayout>
            <Head title="Report Absensi" />

            {/* Background page */}
            <div className="bg-gray-100 min-h-screen py-3 px-5">
                {/* Card container */}
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
                    <div className="mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Rekap Absensi Siswa
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 mb-6">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                router.get(
                                    route("attendances.report"),
                                    filters,
                                    { preserveState: true }
                                );
                            }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full"
                        >
                            <select
                                name="classroom_id"
                                defaultValue={filters.classroom_id || ""}
                                onChange={(e) =>
                                    router.get(
                                        route("attendances.report"),
                                        {
                                            ...filters,
                                            classroom_id: e.target.value,
                                        },
                                        { preserveState: true }
                                    )
                                }
                                className="border rounded p-2 w-full"
                            >
                                <option value="">-- Pilih Kelas --</option>
                                {classrooms.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="subject_id"
                                defaultValue={filters.subject_id || ""}
                                onChange={(e) =>
                                    router.get(
                                        route("attendances.report"),
                                        {
                                            ...filters,
                                            subject_id: e.target.value,
                                        },
                                        { preserveState: true }
                                    )
                                }
                                className="border rounded p-2 w-full"
                            >
                                <option value="">-- Pilih Mapel --</option>
                                {subjects.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="date"
                                name="date"
                                defaultValue={filters.date || ""}
                                onChange={(e) =>
                                    router.get(
                                        route("attendances.report"),
                                        {
                                            ...filters,
                                            date: e.target.value,
                                        },
                                        { preserveState: true }
                                    )
                                }
                                className="border rounded p-2 w-full"
                            />
                        </form>
                    </div>

                    <div className="flex justify-end mb-4">
                        <a
                            href={route("attendances.report.pdf", filters)}
                            target="_blank"
                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1"
                        >
                            Download <FaFilePdf />
                        </a>
                    </div>

                    {/* Table responsive */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse bg-white shadow-sm rounded-md">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-3 py-2">
                                        Tanggal
                                    </th>
                                    <th className="border px-3 py-2">Siswa</th>
                                    <th className="border px-3 py-2">Kelas</th>
                                    <th className="border px-3 py-2">Mapel</th>
                                    <th className="border px-3 py-2">Status</th>
                                    <th className="border px-3 py-2">Guru</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendances.data.length > 0 ? (
                                    attendances.data.map((a) => (
                                        <tr key={a.id}>
                                            <td className="border px-3 py-2">
                                                {a.date}
                                            </td>
                                            <td className="border px-3 py-2">
                                                {a.student.user.name}
                                            </td>
                                            <td className="border px-3 py-2">
                                                {a.classroom.name}
                                            </td>
                                            <td className="border px-3 py-2">
                                                {a.subject.name}
                                            </td>
                                            <td className="border px-3 py-2">
                                                {a.status}
                                            </td>
                                            <td className="border px-3 py-2">
                                                {a.teacher?.name ?? "-"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-4 text-gray-500 italic"
                                        >
                                            Tidak ada data absensi ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="flex justify-center mt-4 flex-wrap gap-1">
                        {attendances.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() =>
                                    link.url &&
                                    router.get(
                                        link.url,
                                        {},
                                        { preserveState: true }
                                    )
                                }
                                className={`px-3 py-1 rounded-md ${
                                    link.active
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
