import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";

export default function EditModal({ show, onClose, user }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
    });

    // Isi form otomatis saat modal dibuka
    useEffect(() => {
        if (user) {
            setData({
                name: user.name || "",
                email: user.email || "",
                password: "", // Kosongkan password saat edit
            });
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gunakan method 'put' dari useForm
        put(`/users/${user.id}`, {
            onSuccess: () => {
                onClose();
                reset(); // Reset form setelah berhasil
            },
        });
    };

    if (!show || !user) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold">Edit Pengguna - Admin</h2>
                    <button onClick={onClose} className="text-gray-500">
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                    <div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nama"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                            required
                        />
                        {errors.name && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.name}
                            </div>
                        )}
                    </div>

                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                            required
                        />
                        {errors.email && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password (kosongkan jika tidak ingin diubah)"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="w-full border rounded-md px-3 py-2"
                        />
                        {errors.password && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded-md"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-yellow-600 text-white rounded-md"
                            disabled={processing}
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
