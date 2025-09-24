<?php
namespace App\Http\Controllers;

use App\Models\Classroom;
use Illuminate\Http\Request;
use inertia;

class ClassroomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Classroom::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $classrooms = $query->paginate(10)->withQueryString();

        return inertia('Classrooms/Index', [
            'classrooms' => $classrooms,
            'filters'    => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Classrooms/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:classrooms,name',
        ]);

        Classroom::create($data);

        return redirect()->route('classrooms.index')->with('success', 'Classroom created');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Classroom $classroom)
    {
        return inertia('Classrooms/Edit', compact('classroom'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Classroom $classroom)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:classrooms,name,' . $classroom->id,
        ]);

        $classroom->update($data);

        return redirect()->route('classrooms.index')->with('success', 'Classroom updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Classroom $classroom)
    {
        $classroom->delete();
        return back()->with('success', 'Classroom deleted');
    }
}