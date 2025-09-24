<?php
namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use inertia;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $query = Subject::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $subjects = $query->paginate(10)->withQueryString();

        return inertia('Subjects/Index', [
            'subjects' => $subjects,
            'filters'  => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Subjects/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:subjects,name',
        ]);

        Subject::create($data);

        return redirect()->route('subjects.index')->with('success', 'Mata Pelajaran Berhasil Ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Subject $subject)
    {
        return inertia('Subjects/Edit', compact('subject'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Subject $subject)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:subjects,name,' . $subject->id,
        ]);

        $subject->update($data);

        return redirect()->route('subjects.index')->with('success', 'Mata Pelajaran Berhasil Diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subject $subject)
    {
        $subject->delete();
        return back()->with('success', 'Mata Pelajaran Berhasil Dihapus');
    }
}