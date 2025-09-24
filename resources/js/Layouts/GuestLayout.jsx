import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
            {/* Logo / Judul */}
            <div className="flex flex-col items-center mb-6">
                <div className="flex items-center -space-x-28 justify-start -ml-16">
                    <Link href="/">
                        <ApplicationLogo />
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-indigo-700">
                            Smart Absensi
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Masuk untuk melanjutkan
                        </p>
                    </div>
                </div>
            </div>

            {/* Card utama, children ditaruh di sini */}
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
                {children}
            </div>

            {/* Footer */}
            <p className="mt-6 text-xs text-gray-500">
                &copy; {new Date().getFullYear()} Smart Absensi. All rights
                reserved.
            </p>
        </div>
    );
}
