import React, { useState } from "react";
import { Link, usePage, router, Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import CreateModal from "@/Components/Roles/CreateModal";
import EditModal from "@/Components/Roles/EditModal";
import Swal from "sweetalert2";

export default function Index() {
    const { roles, permissions } = usePage().props;
    const [showModal, setShowModal] = React.useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Hapus Peran Pengguna",
            text: "Anda yakin akan menghapus ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Hapus",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/roles/${id}`);
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Daftar Peran Pengguna" />

            <CreateModal
                show={showModal}
                onClose={() => setShowModal(false)}
                permissions={permissions}
            />

            <EditModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                role={selectedRole}
                permissions={permissions}
            />

            {/* Background page */}
            <div className="bg-gray-100 min-h-screen py-3 px-5">
                {/* Card container */}
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
                    <div className="mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Daftar Peran Pengguna
                        </h2>
                    </div>

                    {/* Search + Tambah */}
                    <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 mb-6">
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            <FaPlus /> Tambah Hak Akses
                        </button>

                        {/* Tambah Siswa */}
                    </div>

                    {/* Table responsive */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse bg-white shadow-sm rounded-md">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-2 py-2 border">#</th>
                                    <th className="px-2 py-2 border">Nama</th>
                                    <th className="px-2 py-2 border">
                                        Hak Akses
                                    </th>
                                    <th className="px-2 py-2 border">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.data.length > 0 ? (
                                    roles.data.map((role, i) => (
                                        <tr
                                            key={role.id}
                                            className="text-center hover:bg-gray-50"
                                        >
                                            <td className="px-2 py-2 border">
                                                {roles.from + i}
                                            </td>
                                            <td className="px-2 py-2 border">
                                                {role.name}
                                            </td>
                                            <td className="px-2 py-2 border">
                                                <div className="flex flex-wrap gap-2">
                                                    {role.permissions.length >
                                                    0 ? (
                                                        role.permissions.map(
                                                            (permission) => (
                                                                <span
                                                                    key={
                                                                        permission.id
                                                                    }
                                                                    className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800"
                                                                >
                                                                    {
                                                                        permission.name
                                                                    }
                                                                </span>
                                                            )
                                                        )
                                                    ) : (
                                                        <span>-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 border">
                                                <div className="flex flex-wrap justify-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedRole(
                                                                role
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
                                                                role.id
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
                        {roles.links.map((link, i) => (
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
