import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { FaQrcode } from "react-icons/fa";

export default function Scan() {
    const { classroom_id, classroom_name, subject_id, subject_name } =
        usePage().props;

    const [currentTime, setCurrentTime] = useState(new Date());

    // Update waktu setiap detik
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", {
            fps: 10,
            qrbox: 250,
        });

        scanner.render(
            (decodedText) => {
                router.post("/attendances/scan", {
                    qr_code: decodedText,
                    classroom_id,
                    subject_id,
                });
            },
            (error) => {
                console.warn(error);
            }
        );
    }, [classroom_id, subject_id]);

    return (
        <AppLayout>
            <Head title="Absensi Scan" />.
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-5xl mx-auto -mt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kiri: Info kelas, mapel, waktu */}
                    <div className="flex flex-col justify-between">
                        <div>
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6 border-b pb-4">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
                                    <FaQrcode />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Scan Absensi
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        Arahkan kamera ke QR Code untuk
                                        melakukan absensi
                                    </p>
                                </div>
                            </div>

                            {/* Info kelas & mapel */}
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {classroom_name}
                                </span>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {subject_name}
                                </span>
                            </div>
                        </div>

                        {/* Tanggal & waktu */}
                        <div className="text-gray-600 text-lg font-mono border-t pt-4">
                            {currentTime.toLocaleString("id-ID", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                            })}
                        </div>
                    </div>

                    {/* Kanan: Scanner */}
                    <div className="flex justify-center items-center">
                        <div className="relative w-[350px] max-w-full rounded-xl border-2 border-dashed border-indigo-400 bg-gray-50 shadow-md overflow-hidden">
                            <div id="reader" className="w-full"></div>
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                Tempatkan QR di dalam kotak
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
