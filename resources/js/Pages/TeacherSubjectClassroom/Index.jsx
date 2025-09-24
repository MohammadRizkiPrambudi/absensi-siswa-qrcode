import CreateModal from "@/Components/TeacherSubjectClassroom/CreateModal";
import EditModal from "@/Components/TeacherSubjectClassroom/EditModal";
import AppLayout from "@/Layouts/AppLayout";
import { useForm, Link, router, Head } from "@inertiajs/react";
import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

export default function Index({
    data,
    filters,
    classrooms,
    teachers,
    subjects,
}) {
    const { get } = useForm();

    const [showModal, setShowModal] = React.useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        const search = e.target.search.value;
        router.get(
            route("teacher-subject-classroom.index"),
            { search },
            { preserveState: true }
        );
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Hapus Mapping Mengajar?",
            text: "Anda yakin akan menghapus ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Hapus",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/teacher-subject-classroom/${id}`);
            }
        });
    };

    return (
        <AppLayout>
            <CreateModal
                show={showModal}
                classrooms={classrooms}
                subjects={subjects}
                teachers={teachers}
                onClose={() => setShowModal(false)}
            />
            <EditModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                data={selectedData}
                classrooms={classrooms}
                subjects={subjects}
                teachers={teachers}
            />
            <Head title="Mapping Mapel-Guru-Kelas" />
            <div className="bg-gray-100 min-h-screen py-3 px-5">
                {/* Card container */}
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
                    <div className="mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Mapping Guru - Mapel - Kelas
                        </h2>
                    </div>

                    {/* Search + Tambah */}
                    <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 mb-6">
                        {/* Search */}
                        <form
                            onSubmit={handleSearch}
                            className="flex w-full md:w-1/2"
                        >
                            <input
                                type="text"
                                name="search"
                                defaultValue={filters.search || ""}
                                placeholder="Cari Nama Guru..."
                                className="flex-grow px-4 py-2 border rounded-l-md focus:ring focus:ring-blue-200"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                            >
                                Cari
                            </button>
                        </form>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                <FaPlus /> Tambah Mengajar
                            </button>
                        </div>
                    </div>

                    {/* Table responsive */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse bg-white shadow-sm rounded-md">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 border">#</th>
                                    <th className="p-3 border">Guru</th>
                                    <th className="p-3 border">Mapel</th>
                                    <th className="p-3 border">Kelas</th>
                                    <th className="p-3 border">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.length > 0 ? (
                                    data.data.map((item, i) => (
                                        <tr
                                            key={item.id}
                                            className="text-center hover:bg-gray-50"
                                        >
                                            <td className="px-2 py-2 border">
                                                {i +
                                                    1 +
                                                    (data.current_page - 1) *
                                                        data.per_page}
                                            </td>
                                            <td className="px-2 py-2 border">
                                                {item.teacher?.name}
                                            </td>
                                            <td className="px-2 py-2 border">
                                                {item.subject?.name}
                                            </td>
                                            <td className="px-2 py-2 border">
                                                {item.classroom?.name || "-"}
                                            </td>
                                            <td className="px-2 py-2 border">
                                                <div className="flex flex-wrap justify-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedData(
                                                                item
                                                            );
                                                            setShowEditModal(
                                                                true
                                                            );
                                                        }}
                                                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center gap-1"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id
                                                            )
                                                        }
                                                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1"
                                                    >
                                                        <FaTrash />
                                                    </button>
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
                                            Tidak ada data
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-4 flex-wrap gap-1">
                        {data.links.map((link, i) => (
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
