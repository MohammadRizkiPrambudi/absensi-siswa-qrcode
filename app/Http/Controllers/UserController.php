<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Tampilkan daftar pengguna.
     * Menggunakan Inertia::render untuk mengirim data ke komponen React.
     */
    public function index(Request $request)
    {
        // Mengambil pengguna dengan peran 'admin'
        $query = User::role('admin')->with('roles');

        // Fitur pencarian sederhana yang sudah dikelompokkan
        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(10)->through(function ($user) {
            return [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->toArray(),
            ];
        });

        return Inertia::render('Users/Index', [
            'users'   => $users,
            'filters' => $request->only('search'),
        ]);
    }

/**
 * Tampilkan formulir untuk membuat pengguna baru.
 */
    public function create()
    {
        $roles = Role::all()->pluck('name', 'id');

        return Inertia::render('Users/Create', [
            'roles' => $roles,
        ]);
    }

/**
 * Simpan pengguna baru ke database.
 */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name'     => $validatedData['name'],
            'email'    => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        $role = Role::findByName('admin');
        $user->assignRole($role);

        return redirect()->route('users.index')->with('success', 'Pengguna berhasil ditambahkan.');
    }

/**
 * Tampilkan formulir untuk mengedit pengguna.
 *
 *
 */
    public function edit(User $user)
    {
        $roles = Role::all()->pluck('name', 'id');
        $user->load('roles');

        return Inertia::render('Users/Edit', [
            'user'  => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'role_id' => $user->roles->isEmpty() ? null : $user->roles[0]->id,
            ],
            'roles' => $roles,
        ]);
    }

/**
 * Perbarui data pengguna yang ada.
 */
    public function update(Request $request, User $user)
    {
        $validatedData = $request->validate([
            'name'     => ['required', 'string'],
            'email'    => ['required', 'string', 'email', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'string', 'min:6'],

        ]);

        $user->update([
            'name'     => $validatedData['name'],
            'email'    => $validatedData['email'],
            'password' => $request->filled('password') ? Hash::make($validatedData['password']) : $user->password,
        ]);

        $role = Role::findByname('admin');
        $user->syncRoles($role);

        return redirect()->route('users.index')->with('success', 'Pengguna berhasil diperbarui.');
    }

/**
 * Hapus pengguna dari database.
 */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->back()->with('success', 'Pengguna berhasil dihapus.');
    }
}