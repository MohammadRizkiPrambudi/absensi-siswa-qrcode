import React, { useState } from "react";
import { Link, usePage, router, Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaFileExcel,
    FaDownload,
} from "react-icons/fa";
import CreateModal from "@/Components/Students/CreateModal";
import EditModal from "@/Components/Students/EditModal";
import Swal from "sweetalert2";

export default function Index() {
    const { students, filters, classrooms } = usePage().props;
    const [showModal, setShowModal] = React.useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Hapus Siswa?",
            text: "Anda yakin akan menghapus ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Hapus",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/students/${id}`);
            }
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            "/students",
            { search: e.target.search.value },
            { preserveState: true }
        );
    };

    const handleDownload = (student) => {
        if (!student.qr_code_path) {
            Swal.fire("QR Code belum ada!", "", "warning");
            return;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const width = 400;
        const height = 500;
        canvas.width = width;
        canvas.height = height;

        // Background putih
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        // Nama siswa
        ctx.fillStyle = "#000000";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(student.user.name, width / 2, 40);

        // Nama kelas
        ctx.font = "16px Arial";
        ctx.fillText(student.classroom?.name || "Tanpa Kelas", width / 2, 70);

        // Gambar QR
        const qrImg = new Image();
        qrImg.crossOrigin = "anonymous"; // penting kalau pakai file dari storage
        qrImg.src = "/storage/" + student.qr_code_path;

        qrImg.onload = () => {
            const qrSize = 250;
            ctx.drawImage(qrImg, (width - qrSize) / 2, 100, qrSize, qrSize);

            // Tambah NISN di bawah QR
            ctx.font = "16px Arial";
            ctx.fillText("NISN: " + student.nisn, width / 2, 380);

            // Download
            const link = document.createElement("a");
            link.download = `${student.user.name}-qrcode.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        };
    };

    return (
        <AppLayout>
            <Head title="Daftar Siswa" />

            <CreateModal
                show={showModal}
                onClose={() => setShowModal(false)}
                classrooms={classrooms}
            />

            <EditModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                student={selectedStudent}
                classrooms={classrooms}
            />

            {/* Background page */}
            <div className="bg-gray-100 min-h-screen py-3 px-5">
                {/* Card container */}
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
                    <div className="mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Daftar Siswa
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
                                placeholder="Cari nama atau NISN..."
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
                                <FaPlus /> Tambah Siswa
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                <FaFileExcel /> Import Siswa
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
                                    <th className="px-2 py-2 border">Nama</th>
                                    <th className="px-2 py-2 border">NISN</th>
                                    <th className="px-2 py-2 border">Kelas</th>
                                    <th className="px-2 py-2 border">
                                        No HP Ortu
                                    </th>
                                    <th className="px-2 py-2 border">
                                        QR Code
                                    </th>
                                    <th className="px-2 py-2 border">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.data.length > 0 ? (
                                    students.data.map((student, i) => (
                                        <tr
                                            key={student.id}
                                            className="text-center hover:bg-gray-50"
                                        >
                                            <td className="px-2 py-2 border">
                                                {students.from + i}
                                            </td>
                                            <td className="px-2 py-2 border">
                                                {student.user.name}
                                            </td>
                                            <td className="px-2 py-2 border">
                                                {student.nisn}
                                            </td>
                                            <td className="px-2 py-2 border">
                                                {student.classroom?.name || "-"}
                                            </td>
                                            <td className="px-2 py-2 border">
                                                {student.phone_number}
                                            </td>
                                            <td className="px-2 py-2 border">
                                                {student.qr_code_path ? (
                                                    <img
                                                        src={
                                                            "storage/" +
                                                            student.qr_code_path
                                                        }
                                                        alt="QR Code"
                                                        className="w-16 h-16 mx-auto"
                                                    />
                                                ) : (
                                                    <span className="text-gray-400">
                                                        Belum ada
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-2 py-2 border">
                                                <div className="flex flex-wrap justify-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedStudent(
                                                                student
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
                                                            handleDownload(
                                                                student
                                                            )
                                                        }
                                                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
                                                    >
                                                        <FaDownload />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                student.id
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
                        {students.links.map((link, i) => (
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
