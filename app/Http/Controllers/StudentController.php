<?php
namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Student::with('user', 'classroom');
        if ($request->search) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            })
                ->orWhere('nisn', 'like', '%' . $request->search . '%');
        }

        $classrooms = Classroom::select('id', 'name')->get();

        $students = $query->paginate(7)->withQueryString();

        return Inertia('Students/Index', [
            'students'   => $students,
            'filters'    => $request->only(['search']),
            'classrooms' => $classrooms,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $classrooms = Classroom::all();
        return Inertia('Students/Create', compact('classrooms'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'         => 'required|string',
            'email'        => 'required|email|unique:users',
            'password'     => 'required|string|min:6',
            'classroom_id' => 'required|exists:classrooms,id',
            'nisn'         => 'required|string|unique:students,nisn',
            'phone_number' => 'required|string|max:15',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $student = Student::create([
            'user_id'      => $user->id,
            'classroom_id' => $data['classroom_id'],
            'nisn'         => $data['nisn'],
            'phone_number' => $data['phone_number'],
        ]);

        // ambil nama kelas
        $classroom = Classroom::find($data['classroom_id']);
        $folder    = "qrcodes/" . str_replace(' ', '_', strtolower($classroom->name));
        $filePath  = "{$folder}/student_{$student->id}.png";

        // buat folder otomatis kalau belum ada
        Storage::disk('public')->makeDirectory($folder);

        // generate qr code
        Storage::disk('public')->put(
            $filePath,
            QrCode::format('png')->size(200)->generate($student->nisn)
        );

        $student->update(['qr_code_path' => $filePath]);

        return redirect()->route('students.index')->with('success', 'Student created with QR code');
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        return Inertia('Students/Show', compact('student'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $student)
    {
        $classrooms = Classroom::all();
        return Inertia('Students/Edit', compact('student', 'classrooms'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student)
    {
        $data = $request->validate([
            'name'         => 'required|string',
            'email'        => 'required|email|unique:users,email,' . $student->user_id,
            'password'     => 'nullable|string|min:6',
            'classroom_id' => 'required|exists:classrooms,id',
            'nisn'         => 'required|string|unique:students,nisn,' . $student->id,
            'phone_number' => 'required|string|max:15',
        ]);

        // update user
        $student->user->update([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => $data['password'] ? bcrypt($data['password']) : $student->user->password,
        ]);

        // cek kalau nisn atau classroom berubah → regenerate QR
        if ($student->nisn !== $data['nisn'] || $student->classroom_id !== $data['classroom_id']) {
            // hapus qr lama kalau ada
            if ($student->qr_code_path && Storage::disk('public')->exists($student->qr_code_path)) {
                Storage::disk('public')->delete($student->qr_code_path);
            }

            $classroom = Classroom::find($data['classroom_id']);
            $folder    = "qrcodes/" . str_replace(' ', '_', strtolower($classroom->name));
            $filePath  = "{$folder}/student_{$student->id}.png";

            // buat folder kalau belum ada
            Storage::disk('public')->makeDirectory($folder);

            // generate qr code baru pakai NISN BARU
            Storage::disk('public')->put(
                $filePath,
                QrCode::format('png')->size(200)->generate($data['nisn'])
            );

            $student->qr_code_path = $filePath; // update path
        }

        // update student
        $student->update([
            'classroom_id' => $data['classroom_id'],
            'nisn'         => $data['nisn'],
            'phone_number' => $data['phone_number'],
            'qr_code_path' => $student->qr_code_path,
        ]);

        return redirect()->route('students.index')->with('success', 'Student updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        // hapus file qrcode kalau ada
        if ($student->qr_code_path && Storage::disk('public')->exists($student->qr_code_path)) {
            Storage::disk('public')->delete($student->qr_code_path);
        }

        // hapus user terkait
        if ($student->user) {
            $student->user->delete();
        }

        // hapus student
        $student->delete();
        return back()->with('success', 'Student deleted');
    }

    // regenerate QR Code
    public function generateQr(Student $student)
    {
        $classroom = $student->classroom;
        $folder    = $folder    = "qrcodes/" . str_replace(' ', '_', strtolower($classroom->name));
        $filePath  = "{$folder}/student_{$student->id}.png";

        Storage::disk('public')->makeDirectory($folder);

        Storage::disk('public')->put(
            $filePath,
            QrCode::format('png')->size(200)->generate($student->nisn)
        );

        $student->update(['qr_code_path' => $filePath]);

        return back()->with('success', 'QR Code regenerated');
    }
}