<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    /**
     * Display a listing of the teachers.
     */

    public function index(Request $request)
    {
        $query = User::role('teacher');

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $teachers = $query->paginate(10)->withQueryString();

        return Inertia::render('Teachers/Index', [
            'teachers' => $teachers,
            'filters'  => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new teacher.
     */
    public function create()
    {
        return Inertia::render('Teachers/Create');
    }

    /**
     * Store a newly created teacher in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => bcrypt($data['password']),
            'role'     => 'teacher',
        ]);

        return redirect()->route('teachers.index')->with('success', 'Teacher created');
    }

    /**
     * Show the form for editing the specified teacher.
     */
    public function edit(User $teacher)
    {
        return Inertia::render('Teachers/Edit', compact('teacher'));
    }

    /**
     * Update the specified teacher in storage.
     */
    public function update(Request $request, User $teacher)
    {
        $data = $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users,email,' . $teacher->id,
            'password' => 'nullable|string|min:6',
        ]);

        $teacher->update([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => $data['password'] ? bcrypt($data['password']) : $teacher->password,
        ]);

        return redirect()->route('teachers.index')->with('success', 'Teacher updated');
    }

    /**
     * Remove the specified teacher from storage.
     */
    public function destroy(User $teacher)
    {
        $teacher->delete();
        return back()->with('success', 'Teacher deleted');
    }
}