<?php
namespace Database\Seeders;

use App\Models\Classroom;
use App\Models\Student;
use App\Models\Subject;
use App\Models\User;
use DB;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SchoolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
            'name'     => 'Administrator',
            'email'    => 'admin@school.test',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        // 🔹 Guru
        $teacher1 = User::create([
            'name'     => 'Budi Santoso',
            'email'    => 'budi@school.test',
            'password' => Hash::make('password'),
            'role'     => 'teacher',
        ]);

        $teacher2 = User::create([
            'name'     => 'Siti Aminah',
            'email'    => 'siti@school.test',
            'password' => Hash::make('password'),
            'role'     => 'teacher',
        ]);

        // 🔹 Kelas
        $kelas10RPL = Classroom::create(['name' => 'X RPL 1']);
        $kelas12RPL = Classroom::create(['name' => 'XII RPL 1']);

        for ($i = 1; $i <= 10; $i++) {
            $user = User::create([
                'name'     => "Siswa SMK $i",
                'email'    => "rpl{$i}@school.test",
                'password' => Hash::make('password'),
                'role'     => 'student',
            ]);

            Student::create([
                'user_id'      => $user->id,
                'classroom_id' => $kelas10RPL->id,
                'nisn'         => 'RPL' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'qr_code_path' => null,
            ]);
        }

        // 🔹 Siswa SMA/SMK
        for ($i = 1; $i <= 10; $i++) {
            $user = User::create([
                'name'     => "Siswa SMK $i",
                'email'    => "smk{$i}@school.test",
                'password' => Hash::make('password'),
                'role'     => 'student',
            ]);

            Student::create([
                'user_id'      => $user->id,
                'classroom_id' => $kelas12RPL->id,
                'nisn'         => 'SMK' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'qr_code_path' => null,
            ]);
        }

        $mapel1 = Subject::create(['name' => 'Matematika']);
        $mapel2 = Subject::create(['name' => 'Bahasa Inggris']);
        $mapel3 = Subject::create(['name' => 'Pemrograman']);

        DB::table('teacher_subject_classroom')->insert([
            [
                'teacher_id'   => $teacher1->id,
                'subject_id'   => $mapel1->id,
                'classroom_id' => $kelas10RPL->id,
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'teacher_id'   => $teacher2->id,
                'subject_id'   => $mapel3->id,
                'classroom_id' => $kelas12RPL->id,
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
        ]);
    }
}