<?php
namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\Subject;
use App\Models\TeacherSubjectClassroom;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherSubjectClassroomController extends Controller
{
    public function index(Request $request)
    {
        $query = TeacherSubjectClassroom::with(['teacher', 'subject', 'classroom']);

        if ($request->search) {
            $query->whereHas('teacher', fn($q) =>
                $q->where('name', 'like', '%' . $request->search . '%')
            );
        }

        $data       = $query->paginate(10)->withQueryString();
        $classrooms = Classroom::all();
        $subjects   = Subject::all();
        $teachers   = User::role('teacher')->get();

        return Inertia::render('TeacherSubjectClassroom/Index', [
            'data'       => $data,
            'filters'    => $request->only('search'),
            'classrooms' => $classrooms,
            'subjects'   => $subjects,
            'teachers'   => $teachers,
        ]);
    }

    public function create()
    {
        return Inertia::render('TeacherSubjectClassroom/Create', [
            'teachers'   => User::where('role', 'teacher')->get(),
            'subjects'   => Subject::all(),
            'classrooms' => Classroom::all(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'teacher_id'   => 'required|exists:users,id',
            'subject_id'   => 'required|exists:subjects,id',
            'classroom_id' => 'required|exists:classrooms,id',
        ]);

        TeacherSubjectClassroom::create($data);

        return redirect()->route('teacher-subject-classroom.index')->with('success', 'Data created');
    }

    public function edit(TeacherSubjectClassroom $teacherSubjectClassroom)
    {
        return Inertia::render('TeacherSubjectClassroom/Edit', [
            'item'       => $teacherSubjectClassroom->load(['teacher', 'subject', 'classroom']),
            'teachers'   => User::where('role', 'teacher')->get(),
            'subjects'   => Subject::all(),
            'classrooms' => Classroom::all(),
        ]);
    }

    public function update(Request $request, TeacherSubjectClassroom $teacherSubjectClassroom)
    {
        $data = $request->validate([
            'teacher_id'   => 'required|exists:users,id',
            'subject_id'   => 'required|exists:subjects,id',
            'classroom_id' => 'required|exists:classrooms,id',
        ]);

        $teacherSubjectClassroom->update($data);

        return redirect()->route('teacher-subject-classroom.index')->with('success', 'Data updated');
    }

    public function destroy(TeacherSubjectClassroom $teacherSubjectClassroom)
    {
        $teacherSubjectClassroom->delete();
        return back()->with('success', 'Data deleted');
    }
}