import React from "react";
import { Link, usePage, Head, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { FaCamera, FaFileExcel } from "react-icons/fa";

export default function Index() {
    const { assignments } = usePage().props;

    console.log(assignments);

    return (
        <AppLayout>
            <Head title="Absensi Manual" />

            {/* Background page */}
            <div className="bg-gray-100 min-h-screen py-3 px-5">
                {/* Card container */}
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
                    <div className="mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Absensi Siswa
                        </h2>
                        <p className="mb-4 text-gray-600">
                            Pilih kelas dan mata pelajaran untuk melakukan
                            absensi
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 mb-6">
                        {/* Search */}
                        <form
                            // onSubmit={handleSearch}
                            className="flex w-full md:w-1/2"
                        >
                            <input
                                type="text"
                                name="search"
                                // defaultValue={filters.search || ""}
                                placeholder="Cari Nama Kelas atau Mapel"
                                className="flex-grow px-4 py-2 border rounded-l-md focus:ring focus:ring-blue-200"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                            >
                                Cari
                            </button>
                        </form>
                    </div>

                    {/* Table responsive */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse bg-white shadow-sm rounded-md">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-2 py-2 border">#</th>
                                    <th className="px-2 py-2 border">Kelas</th>
                                    <th className="px-2 py-2 border">
                                        Mata Pelajaran
                                    </th>
                                    <th className="px-2 py-2 border">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignments.data.length > 0 ? (
                                    assignments.data.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="text-center hover:bg-gray-50"
                                        >
                                            <td className="px-2 py-2 border">
                                                {index + 1}
                                            </td>
                                            <td className="px-2 py-2 border">
                                                {item.subject?.name}
                                            </td>
                                            <td className="px-2 py-2 border">
                                                {item.classroom?.name}
                                            </td>
                                            <td className="px-2 py-2 border">
                                                <div className="flex flex-wrap justify-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            router.get(
                                                                route(
                                                                    "attendances.manual",
                                                                    [
                                                                        item
                                                                            .classroom
                                                                            .id,
                                                                        item
                                                                            .subject
                                                                            .id,
                                                                    ]
                                                                )
                                                            )
                                                        }
                                                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center gap-1"
                                                    >
                                                        Manual <FaFileExcel />
                                                    </button>
                                                    <Link
                                                        href={route(
                                                            "attendances.scan",
                                                            {
                                                                classroom_id:
                                                                    item
                                                                        .classroom
                                                                        .id,
                                                                subject_id:
                                                                    item.subject
                                                                        .id,
                                                            }
                                                        )}
                                                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1"
                                                    >
                                                        Scan QR <FaCamera />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="py-4 text-center text-gray-500"
                                        >
                                            Anda belum memiliki jadwal mengajar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="flex justify-center mt-4 flex-wrap gap-1">
                        {assignments.links.map((link, i) => (
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
