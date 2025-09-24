import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import {
    FaUserGraduate,
    FaUserCheck,
    FaUserClock,
    FaUserTimes,
} from "react-icons/fa";
import { Head } from "@inertiajs/react";
import { Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard({
    stats,
    isTeacher,
    weeklyChartData,
    monthlyChartData,
    yearlyChartData,
}) {
    const adminCards = [
        {
            title: "Total Siswa",
            value: stats.total_students,
            color: "text-blue-600",
            icon: <FaUserGraduate className="text-4xl text-blue-600" />,
        },
        {
            title: "Hadir Hari Ini",
            value: stats.present_today,
            color: "text-green-600",
            icon: <FaUserCheck className="text-4xl text-green-600" />,
        },
        {
            title: "Izin",
            value: stats.permit_today,
            color: "text-yellow-500",
            icon: <FaUserClock className="text-4xl text-yellow-500" />,
        },
        {
            title: "Alpa",
            value: stats.absent_today,
            color: "text-red-600",
            icon: <FaUserTimes className="text-4xl text-red-600" />,
        },
    ];

    const teacherCards = [
        {
            title: "Total Siswa",
            value: stats.total_students,
            color: "text-blue-600",
            icon: <FaUserGraduate className="text-4xl text-blue-600" />,
        },
        {
            title: "Hadir",
            value: stats.present_today,
            color: "text-green-600",
            icon: <FaUserCheck className="text-4xl text-green-600" />,
        },
        {
            title: "Izin",
            value: stats.permit_today,
            color: "text-yellow-500",
            icon: <FaUserClock className="text-4xl text-yellow-500" />,
        },
        {
            title: "Alpa",
            value: stats.absent_today,
            color: "text-red-600",
            icon: <FaUserTimes className="text-4xl text-red-600" />,
        },
    ];

    const createChartData = (data) => ({
        labels: data.labels,
        datasets: [
            {
                label: "Hadir",
                data: data.present,
                borderColor: "rgb(34, 197, 94)",
                backgroundColor: "rgba(34, 197, 94, 0.5)",
                tension: 0.4,
            },
            {
                label: "Izin",
                data: data.permit,
                borderColor: "rgb(234, 179, 8)",
                backgroundColor: "rgba(234, 179, 8, 0.5)",
                tension: 0.4,
            },
            {
                label: "Alpa",
                data: data.absent,
                borderColor: "rgb(239, 68, 68)",
                backgroundColor: "rgba(239, 68, 68, 0.5)",
                tension: 0.4,
            },
        ],
    });

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "",
            },
        },
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <h2 className="text-2xl font-bold mb-6">
                Dashboard {isTeacher ? "Guru" : "Admin"}
            </h2>

            {/* Card Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {(isTeacher ? teacherCards : adminCards).map((card, i) => (
                    <div
                        key={i}
                        className="bg-white p-6 rounded-xl shadow-md border flex items-center gap-4"
                    >
                        <div className="p-3 rounded-full bg-gray-100">
                            {card.icon}
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">
                                {card.title}
                            </h3>
                            <p className={`text-3xl font-bold ${card.color}`}>
                                {card.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Grafik */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Rekap Absensi Mingguan
                    </h3>
                    <Line
                        options={{
                            ...chartOptions,
                            plugins: {
                                ...chartOptions.plugins,
                                title: {
                                    display: true,
                                    text: "Absensi 7 Hari Terakhir",
                                },
                            },
                        }}
                        data={createChartData(weeklyChartData)}
                    />
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Rekap Absensi Bulanan
                    </h3>
                    <Bar
                        options={{
                            ...chartOptions,
                            plugins: {
                                ...chartOptions.plugins,
                                title: {
                                    display: true,
                                    text: "Absensi 30 Hari Terakhir",
                                },
                            },
                        }}
                        data={createChartData(monthlyChartData)}
                    />
                </div>
            </div>
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">
                    Rekap Absensi Tahunan
                </h3>
                <Bar
                    options={{
                        ...chartOptions,
                        plugins: {
                            ...chartOptions.plugins,
                            title: {
                                display: true,
                                text: "Absensi 12 Bulan Terakhir",
                            },
                        },
                    }}
                    data={createChartData(yearlyChartData)}
                />
            </div>
        </AppLayout>
    );
}
