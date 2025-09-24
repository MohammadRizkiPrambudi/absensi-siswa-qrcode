<?php
namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Classroom;
use App\Models\DailyAttendance;
use App\Models\Student;
use App\Models\Subject;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class AttendanceController extends Controller
{

    public function index(Request $request)
    {
        $teacher = auth()->user();

        //      if ($user->hasRole('teacher')) {
        //     $query = $user->teacherSubjectClassrooms()->with(['subject', 'classroom']);
        // } elseif ($user->hasRole('admin')) {
        //     $query = \App\Models\TeacherSubjectClassroom::with(['subject', 'classroom']);
        // } else {
        //     abort(403, 'User does not have the right roles.');
        // }

        // ambil kelas & mapel yg diajarkan guru
        $query = $teacher->teacherSubjectClassrooms()
            ->with(['subject', 'classroom']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->whereHas('subject', function ($q2) use ($request) {
                    $q2->where('name', 'like', '%' . $request->search . '%');
                })->orWhereHas('classroom', function ($q2) use ($request) {
                    $q2->where('name', 'like', '%' . $request->search . '%');
                });
            });
        }

        $assignments = $query->paginate(7)->withQueryString();

        return Inertia::render('Attendance/Index', [
            'assignments' => $assignments,
        ]);
    }

    public function manual(Classroom $classroom, Subject $subject)
    {
        $students = $classroom->students()
            ->with('user')
            ->get();

        return Inertia::render('Attendance/Manual', [
            'classroom' => $classroom,
            'subject'   => $subject,
            'students'  => $students,
            'today'     => now()->toDateString(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'classroom_id'             => 'required|exists:classrooms,id',
            'subject_id'               => 'required|exists:subjects,id',
            'date'                     => 'required|date',
            'attendances'              => 'required|array',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status'     => 'required|string',
        ]);

        $created = 0;
        $updated = 0;

        foreach ($request->attendances as $attendance) {
            $record = Attendance::updateOrCreate(
                [
                    'student_id' => $attendance['student_id'],
                    'date'       => $request->date,
                    'subject_id' => $request->subject_id,
                ],
                [
                    'teacher_id'   => auth()->id(),
                    'classroom_id' => $request->classroom_id,
                    'status'       => $attendance['status'],
                    'note'         => $attendance['note'] ?? null,
                ]
            );

            $record->wasRecentlyCreated ? $created++ : $updated++;
        }

        if ($created > 0 && $updated === 0) {
            $msg = "$created absensi baru berhasil disimpan.";
        } elseif ($updated > 0 && $created === 0) {
            $msg = "$updated absensi berhasil diperbarui.";
        } else {
            $msg = "$created absensi baru disimpan & $updated absensi diperbarui.";
        }

        return redirect()->route('attendances.index')->with('success', $msg);
    }

    public function scanPage(Request $request)
    {
        $classroom = Classroom::find($request->classroom_id);
        $subject   = Subject::find($request->subject_id);
        return inertia('Attendance/Scan', [
            'classroom_id'   => $classroom?->id,
            'classroom_name' => $classroom?->name,
            'subject_id'     => $subject?->id,
            'subject_name'   => $subject?->name,
        ]);

    }

    public function scanStore(Request $request)
    {
        $request->validate([
            'qr_code'      => 'required|string',
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id'   => 'required|exists:subjects,id',
        ]);

        $student = Student::where('nisn', $request->qr_code)->firstOrFail();

        $attendance = Attendance::updateOrCreate(
            [
                'student_id' => $student->id,
                'date'       => now()->toDateString(),
                'subject_id' => $request->subject_id,
            ],
            [
                'classroom_id' => $request->classroom_id,
                'teacher_id'   => auth()->id(),
                'status'       => 'Present',
            ]
        );

        $message = "Absensi berhasil!\n" .
        "Nama: {$attendance->student->user->name}\n" .
        "Kelas: {$attendance->classroom->name}\n" .
        "Mapel: {$attendance->subject->name}\n" .
        "nohp : {$attendance->student->phone_number}\n" .
        "Waktu: " . now()->format('d-m-Y H:i');

        // Panggil botWAlokal;
        $response = Http::post("http://localhost:5000/send-wa", [
            "to"      => $attendance->student->phone_number, // nomor tujuan (format: 628xxx)
            "message" => $message,
        ]);

        if ($response->failed()) {
            \Log::error("Gagal kirim WA: " . $response->body());
        }

        return redirect()->back()->with('success', "{$student->user->name} berhasil absen.");
    }

    public function report(Request $request)
    {
        $query = Attendance::with(['student.user', 'classroom', 'subject', 'teacher']);

        if (auth()->user()->hasRole('teacher')) {
            $query->where('teacher_id', auth()->id());
        } elseif (auth()->user()->hasRole('admin')) {
            // biarkan kosong → admin bebas
        } else {
            abort(403, 'User does not have the right roles.');
        }

        // Filter kelas
        if ($request->classroom_id) {
            $query->where('classroom_id', $request->classroom_id);
        }

        // Filter mapel
        if ($request->subject_id) {
            $query->where('subject_id', $request->subject_id);
        }

        // Filter tanggal
        if ($request->date) {
            $query->whereDate('date', $request->date);
        }

        $attendances = $query->orderBy('date', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Admin bisa akses semua kelas & mapel, guru hanya yg dia ampu
        if (auth()->user()->hasRole('teacher')) {
            $classrooms = auth()->user()->teacherSubjectClassrooms->pluck('classroom')->unique('id');
            $subjects   = auth()->user()->teacherSubjectClassrooms->pluck('subject')->unique('id');
        } else {
            $classrooms = Classroom::all(['id', 'name']);
            $subjects   = Subject::all(['id', 'name']);
        }

        return Inertia::render('Attendance/Report', [
            'attendances' => $attendances,
            'filters'     => $request->only(['classroom_id', 'subject_id', 'date']),
            'classrooms'  => $classrooms,
            'subjects'    => $subjects,
        ]);
    }

    public function reportPdf(Request $request)
    {
        $query = Attendance::with(['student.user', 'classroom', 'subject', 'teacher']);

        // Batasi kalau role guru
        if (auth()->user()->hasRole('teacher') && ! auth()->user()->hasRole('admin')) {
            $query->where('teacher_id', auth()->id());
        }

        if ($request->classroom_id) {
            $query->where('classroom_id', $request->classroom_id);
        }
        if ($request->subject_id) {
            $query->where('subject_id', $request->subject_id);
        }
        if ($request->date) {
            $query->whereDate('date', $request->date);
        }

        $attendances = $query->orderBy('date', 'desc')->get();

        if ($attendances->isEmpty()) {
            return back()->with('error', 'Data absensi tidak ditemukan.');
        }

        $pdf = Pdf::loadView('pdf.report', [
            'attendances' => $attendances,
            'filters'     => $request->only(['classroom_id', 'subject_id', 'date']),
        ]);

        return $pdf->stream('rekap-absensi.pdf');
    }

    public function dailyScanPage()
    {
        return inertia('Attendance/DailyScan');
    }

    public function dailyScanStore(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|string',
        ]);

        $student = Student::where('nisn', $request->qr_code)->firstOrFail();

        // Tentukan waktu masuk sekolah (contoh: 07:00)
        $schoolStartTime = '07:00:00';
        $currentTime     = now()->toTimeString();

        $status = 'Present';
        if ($currentTime > $schoolStartTime) {
            $status = 'Late';
        }

        $attendance = DailyAttendance::updateOrCreate(
            [
                'student_id' => $student->id,
                'date'       => now()->toDateString(),
            ],
            [
                'status'        => $status, // Gunakan variabel status yang baru
                'check_in_time' => $currentTime,
            ]
        );

        $message = "Absensi pagi berhasil!\n" .
        "Nama: {$student->user->name}\n" .
        "Waktu: " . now()->format('d-m-Y H:i');

        // Panggil botWAlokal;
        $response = Http::post("http://localhost:5000/send-wa", [
            "to"      => $student->phone_number,
            "message" => $message,
        ]);

        if ($response->failed()) {
            \Log::error("Gagal kirim WA: " . $response->body());
        }

        return redirect()->back()->with('success', "{$student->user->name} berhasil absen pagi.");
    }

}