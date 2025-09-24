<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Tampilkan daftar semua peran.
     */
    public function index()
    {
        // Pastikan pengguna memiliki izin untuk melihat peran.
        // $this->authorize('viewAny', Role::class);

        // Ambil daftar peran dengan pagination dan urutkan berdasarkan nama.
        $roles = Role::with('permissions')
            ->paginate(10)
            ->through(fn($role) => [
                'id'          => $role->id,
                'name'        => $role->name,
                'permissions' => $role->permissions->map(fn($permission) => [
                    'id'   => $permission->id,
                    'name' => $permission->name,
                ]),
            ]);

        $permissions = Permission::select('id', 'name')->get();
        return Inertia::render('Roles/Index', [
            'roles'       => $roles,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Tampilkan formulir untuk membuat peran baru.
     */
    public function create()
    {
        $this->authorize('create', Role::class);

        $permissions = Permission::all()->pluck('name', 'id');

        return Inertia::render('Roles/Create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Simpan peran baru ke database.
     */
    public function store(Request $request)
    {
        // $this->authorize('create', Role::class);

        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255', 'unique:roles,name'],
            'permissions' => ['nullable', 'array'],
        ]);

        $role = Role::create(['name' => $validated['name']]);
        $role->syncPermissions($validated['permissions'] ?? []);

        return redirect()->route('roles.index')->with('success', 'Peran berhasil dibuat.');
    }

    /**
     * Tampilkan formulir untuk mengedit peran yang ada.
     */
    public function edit(Role $role)
    {
        // $this->authorize('update', $role);

        $permissions = Permission::all()->pluck('name', 'id');

        // Dapatkan izin yang sudah dimiliki oleh peran ini.
        $rolePermissions = $role->permissions->pluck('id')->toArray();

        return Inertia::render('Roles/Edit', [
            'role'            => [
                'id'   => $role->id,
                'name' => $role->name,
            ],
            'permissions'     => $permissions,
            'rolePermissions' => $rolePermissions,
        ]);
    }

    /**
     * Perbarui peran di database.
     */
    public function update(Request $request, Role $role)
    {

        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255', Rule::unique('roles')->ignore($role->id)],
            'permissions' => ['nullable', 'array'],
        ]);

        $role->update(['name' => $validated['name']]);
        $role->syncPermissions($validated['permissions'] ?? []);

        return redirect()->route('roles.index')->with('success', 'Peran berhasil diperbarui.');
    }

    /**
     * Hapus peran dari database.
     */
    public function destroy(Role $role)
    {
        // Pencegahan: Jangan biarkan peran 'admin' atau 'super-admin' dihapus.
        if (in_array($role->name, ['admin'])) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus peran penting.');
        }
        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Peran berhasil dihapus.');
    }
}