<?php
namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        // $this->call(SchoolSeeder::class);
        $admin   = Role::create(['name' => 'admin']);
        $teacher = Role::create(['name' => 'teacher']);
        $student = Role::create(['name' => 'student']);

        Permission::create(['name' => 'manage students']);
        Permission::create(['name' => 'manage teachers']);
        Permission::create(['name' => 'view attendance']);

        $admin->givePermissionTo(Permission::all());
        $teacher->givePermissionTo('view attendance');
        $student->givePermissionTo('view attendance');

        $user = User::factory()->create([
            'name'     => 'Super Admin',
            'email'    => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);
        $user->assignRole('admin');

        // Guru 1
        $teacher1 = User::firstOrCreate(
            ['email' => 'guru1@example.com'],
            [
                'name'     => 'Budiman Admojo',
                'password' => Hash::make('password'),
            ]
        );
        $teacher1->assignRole($teacher);

        // Guru 2
        $teacher2 = User::firstOrCreate(
            ['email' => 'guru2@example.com'],
            [
                'name'     => 'Kusmadi',
                'password' => Hash::make('password'),
            ]
        );
        $teacher2->assignRole($teacher);
    }
}