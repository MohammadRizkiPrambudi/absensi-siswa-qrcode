import React, { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function AppLayout({ children }) {
    const { url, props } = usePage();
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const userDropdownRef = useRef(null);
    const desktopDropdownRefs = useRef({});

    const user = props.auth.user;
    const roles = user?.roles || [];

    const { flash } = usePage().props;

    useEffect(() => {
        const handleClickOutside = (e) => {
            let isInsideAnyDesktopDropdown = false;
            for (const key in desktopDropdownRefs.current) {
                if (
                    desktopDropdownRefs.current[key] &&
                    desktopDropdownRefs.current[key].contains(e.target)
                ) {
                    isInsideAnyDesktopDropdown = true;
                    break;
                }
            }

            if (!isInsideAnyDesktopDropdown) {
                setActiveDropdown(null);
            }

            if (
                userDropdownRef.current &&
                !userDropdownRef.current.contains(e.target)
            ) {
                setUserDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    let menus = [];

    if (roles.includes("admin")) {
        menus = [
            { name: "Dashboard", href: "/dashboard" },
            {
                name: "Data Master",
                href: "/data-master",
                children: [
                    { name: "Mata Pelajaran", href: "/subjects" },
                    { name: "Kelas", href: "/classrooms" },
                    { name: "Guru", href: "/teachers" },
                    { name: "Siswa", href: "/students" },
                    {
                        name: "Mengajar (Guru & Mapel)",
                        href: "/teacher-subject-classroom",
                    },
                ],
            },
            { name: "Rekap Absensi", href: "/attendances/report" },
            {
                name: "Manajemen Pengguna",
                href: "/manajemen-pengguna",
                children: [
                    { name: "Pengguna", href: "/users" },
                    { name: "Peran Pengguna", href: "/roles" },
                    { name: "Hak Akses", href: "/permissions" },
                ],
            },
        ];
    } else if (roles.includes("teacher")) {
        menus = [
            { name: "Dashboard", href: "/dashboard" },
            { name: "Absensi", href: "/attendances" },
            { name: "Rekap Absensi", href: "/attendances/report" },
        ];
    }

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const isMenuActive = (menu) => {
        if (menu.href === "/attendances") {
            return url === "/attendances";
        }
        if (menu.href === "/attendances/report") {
            return url.startsWith("/attendances/report");
        }
        return url.startsWith(menu.href);
    };

    const handleDropdownClick = (menuName) => {
        setActiveDropdown(activeDropdown === menuName ? null : menuName);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Navbar (fixed) */}
            <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-600 to-indigo-600 shadow px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo dan Nama Aplikasi */}
                    <div className="flex items-center gap-2">
                        <div className="bg-white p-2 rounded-lg shadow-md">
                            <img
                                src="/logo/logo.png"
                                alt="Logo Smart Absensi App"
                                className="h-6 w-auto"
                            />
                        </div>
                        <span className="font-bold text-lg text-white">
                            Smart Absensi App
                        </span>
                    </div>

                    {/* Desktop Menu dan User Dropdown hanya jika user login */}
                    {user ? (
                        <>
                            <nav className="hidden md:flex gap-4 justify-center flex-1">
                                {menus.map((menu, i) =>
                                    menu.children ? (
                                        <div
                                            key={i}
                                            className="relative group"
                                            ref={(el) =>
                                                (desktopDropdownRefs.current[
                                                    menu.name
                                                ] = el)
                                            }
                                        >
                                            <button
                                                onClick={() =>
                                                    handleDropdownClick(
                                                        menu.name
                                                    )
                                                }
                                                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                                                    url.startsWith(menu.href) ||
                                                    activeDropdown === menu.name
                                                        ? "bg-white text-blue-600"
                                                        : "text-white hover:bg-blue-500"
                                                }`}
                                            >
                                                {menu.name}
                                                {activeDropdown ===
                                                menu.name ? (
                                                    <FaChevronUp className="text-xs" />
                                                ) : (
                                                    <FaChevronDown className="text-xs" />
                                                )}
                                            </button>
                                            {activeDropdown === menu.name && (
                                                <div className="absolute mt-2 w-56 bg-white rounded-md shadow-md py-2 z-50">
                                                    {menu.children.map(
                                                        (child, j) => (
                                                            <Link
                                                                key={j}
                                                                href={
                                                                    child.href
                                                                }
                                                                className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                                                                    url.startsWith(
                                                                        child.href
                                                                    )
                                                                        ? "text-blue-600 font-semibold"
                                                                        : "text-gray-700"
                                                                }`}
                                                            >
                                                                {child.name}
                                                            </Link>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            key={i}
                                            href={menu.href}
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                                                isMenuActive(menu)
                                                    ? "bg-white text-blue-600"
                                                    : "text-white hover:bg-blue-500"
                                            }`}
                                        >
                                            {menu.name}
                                        </Link>
                                    )
                                )}
                            </nav>
                            {/* User Dropdown */}
                            <div
                                className="relative hidden md:block"
                                ref={userDropdownRef}
                            >
                                <button
                                    onClick={() =>
                                        setUserDropdownOpen(!userDropdownOpen)
                                    }
                                    className="flex items-center gap-1 text-white font-medium px-3 py-2 rounded-md hover:bg-blue-500"
                                >
                                    {user?.name || "User"}
                                    {userDropdownOpen ? (
                                        <FaChevronUp className="text-xs" />
                                    ) : (
                                        <FaChevronDown className="text-xs" />
                                    )}
                                </button>
                                {userDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-md py-2 z-50">
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Logout
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        // Tampilkan tombol login jika belum login
                        <Link
                            href="/login"
                            className="hidden md:block px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 rounded-md"
                        >
                            Login
                        </Link>
                    )}

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden text-white focus:outline-none"
                    >
                        ☰
                    </button>
                </div>
                {/* Mobile Menu - Posisi Absolute & Z-Index Tinggi */}
                {mobileOpen && (
                    <div className="absolute top-16 left-0 right-0 z-40 flex flex-col space-y-2 md:hidden bg-blue-700 rounded-b-lg p-3">
                        {user ? (
                            <>
                                {menus.map((menu, i) =>
                                    menu.children ? (
                                        <div key={i} className="flex flex-col">
                                            <button
                                                onClick={() =>
                                                    handleDropdownClick(
                                                        menu.name
                                                    )
                                                }
                                                className="flex items-center justify-between px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 rounded-md"
                                            >
                                                {menu.name}
                                                {activeDropdown ===
                                                menu.name ? (
                                                    <FaChevronUp className="text-xs" />
                                                ) : (
                                                    <FaChevronDown className="text-xs" />
                                                )}
                                            </button>
                                            {activeDropdown === menu.name && (
                                                <div className="ml-4 flex flex-col mt-1 border-l border-blue-400 pl-2">
                                                    {menu.children.map(
                                                        (child, j) => (
                                                            <Link
                                                                key={j}
                                                                href={
                                                                    child.href
                                                                }
                                                                className={`px-3 py-2 rounded-md text-sm ${
                                                                    url.startsWith(
                                                                        child.href
                                                                    )
                                                                        ? "bg-white text-blue-600"
                                                                        : "text-white hover:bg-blue-600"
                                                                }`}
                                                            >
                                                                {child.name}
                                                            </Link>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            key={i}
                                            href={menu.href}
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                                                isMenuActive(menu)
                                                    ? "bg-white text-blue-600"
                                                    : "text-white hover:bg-blue-600"
                                            }`}
                                        >
                                            {menu.name}
                                        </Link>
                                    )
                                )}
                                <hr className="border-blue-400 my-2" />
                                <Link
                                    href="/profile"
                                    className="px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 rounded-md"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="text-left px-3 py-2 rounded-md text-sm font-medium text-red-200 hover:bg-red-500 hover:text-white"
                                >
                                    Logout
                                </Link>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 rounded-md"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                )}
            </header>
            <Toaster position="top-right" reverseOrder={false} />
            <main className="flex-1 p-6 pt-24">{children}</main>
        </div>
    );
}
