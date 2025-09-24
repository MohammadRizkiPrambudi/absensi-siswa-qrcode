import React, { useState } from "react";
import { Link, usePage, router, Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import CreateModal from "@/Components/Permissions/CreateModal";
import EditModal from "@/Components/Permissions/EditModal";
import Swal from "sweetalert2";

export default function Index() {
    const { permissions, filters } = usePage().props;
    const [showModal, setShowModal] = React.useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState(null);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Hapus Hak Akses",
            text: "Anda yakin akan menghapus ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Hapus",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/permissions/${id}`);
            }
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            "/permissions",
            { search: e.target.search.value },
            { preserveState: true }
        );
    };

    return (
        <AppLayout>
            <Head title="Daftar Hak Akses" />

            <CreateModal show={showModal} onClose={() => setShowModal(false)} />

            <EditModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                permission={selectedPermission}
            />

            {/* Background page */}
            <div className="bg-gray-100 min-h-screen py-3 px-5">
                {/* Card container */}
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
                    <div className="mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Daftar Hak Akses
                        </h2>
                    </div>

                    {/* Search + Tambah */}
                    <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 mb-6">
                        <form
                            onSubmit={handleSearch}
                            className="flex w-full md:w-1/2"
                        >
                            <input
                                type="text"
                                name="search"
                                defaultValue={filters.search || ""}
                                placeholder="Cari Hak Akses"
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
                                <FaPlus /> Tambah Hak Akses
                            </button>
                        </div>

                        {/* Tambah Siswa */}
                    </div>

                    {/* Table responsive */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse bg-white shadow-sm rounded-md">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-2 py-2 border">#</th>
                                    <th className="px-2 py-2 border">
                                        Hak Akses
                                    </th>
                                    <th className="px-2 py-2 border">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {permissions.data.length > 0 ? (
                                    permissions.data.map((permission, i) => (
                                        <tr
                                            key={permission.id}
                                            className="text-center hover:bg-gray-50"
                                        >
                                            <td className="px-2 py-2 border">
                                                {permissions.from + i}
                                            </td>
                                            <td className="px-2 py-2 border">
                                                {permission.name}
                                            </td>
                                            <td className="px-2 py-2 border">
                                                <div className="flex flex-wrap justify-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedPermission(
                                                                permission
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
                                                                permission.id
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
                        {permissions.links.map((link, i) => (
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
