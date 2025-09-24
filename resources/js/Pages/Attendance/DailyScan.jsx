import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { FaQrcode, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function DailyScan() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [scanStatus, setScanStatus] = useState("idle"); // 'idle', 'success', 'error'

    // Perbarui waktu setiap detik
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
                router.post(
                    "/attendances/daily-scan",
                    {
                        qr_code: decodedText,
                    },
                    {
                        onSuccess: () => {
                            setScanStatus("success");
                            // Reset status setelah 3 detik
                            setTimeout(() => setScanStatus("idle"), 3000);
                        },
                        onError: () => {
                            setScanStatus("error");
                            // Reset status setelah 3 detik
                            setTimeout(() => setScanStatus("idle"), 3000);
                        },
                        preserveState: true,
                    }
                );
            },
            (error) => {
                console.warn(error);
            }
        );
    }, []);

    const getBorderColor = () => {
        if (scanStatus === "success") return "border-green-500 animate-pulse";
        if (scanStatus === "error") return "border-red-500 animate-shake";
        return "border-indigo-400";
    };

    const getIcon = () => {
        if (scanStatus === "success")
            return <FaCheckCircle className="text-green-500" />;
        if (scanStatus === "error")
            return <FaTimesCircle className="text-red-500" />;
        return <FaQrcode className="text-indigo-600" />;
    };

    return (
        <AppLayout>
            <Head title="Absensi Pagi" />
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-5xl mx-auto -mt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kiri: Info Waktu */}
                    <div className="flex flex-col justify-between">
                        <div>
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6 border-b pb-4">
                                <div className="p-2 bg-gray-100 rounded-full">
                                    {getIcon()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Absensi Pagi
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        Scan QR Code untuk Absensi Masuk Sekolah
                                    </p>
                                </div>
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
                        <div
                            className={`relative w-[350px] max-w-full rounded-xl border-2 border-dashed ${getBorderColor()} bg-gray-50 shadow-md overflow-hidden`}
                        >
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
