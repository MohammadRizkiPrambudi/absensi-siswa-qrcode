<?php
namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user      = auth()->user();
        $isTeacher = $user->hasRole('teacher');

        // Logic untuk Admin dan Guru
        $baseQuery = Attendance::query();
        if ($isTeacher) {
            $baseQuery->where('teacher_id', $user->id);
        }

        // Statistik Ringkasan Hari Ini
        $today         = now()->toDateString();
        $totalStudents = $isTeacher ? $user->teacherSubjectClassrooms->flatMap->classroom->flatMap->students->unique('id')->count() : Student::count();
        $presentCount  = (clone $baseQuery)->where('status', 'Present')->whereDate('date', $today)->count();
        $permitCount   = (clone $baseQuery)->whereIn('status', ['Permit', 'Sick'])->whereDate('date', $today)->count();
        $absentCount   = (clone $baseQuery)->where('status', 'Absent')->whereDate('date', $today)->count();

        // Data Grafik
        $weeklyData = (clone $baseQuery)->whereBetween('date', [now()->subDays(6), now()])
            ->selectRaw('DATE(date) as day, status, count(*) as count')
            ->groupBy('day', 'status')
            ->get();

        $monthlyData = (clone $baseQuery)->whereBetween('date', [now()->subDays(30), now()])
            ->selectRaw('DAY(date) as day, status, count(*) as count')
            ->groupBy('day', 'status')
            ->get();

        $yearlyData = (clone $baseQuery)->whereBetween('date', [now()->subMonths(11)->startOfMonth(), now()->endOfMonth()])
            ->selectRaw('MONTH(date) as month, status, count(*) as count')
            ->groupBy('month', 'status')
            ->get();

        $weeklyChart  = $this->formatChartData($weeklyData, 'day', 7, 'day');
        $monthlyChart = $this->formatChartData($monthlyData, 'day', 30, 'day');
        $yearlyChart  = $this->formatChartData($yearlyData, 'month', 12, 'month');

        return Inertia::render('Dashboard', [
            'stats'            => [
                'total_students' => $totalStudents,
                'present_today'  => $presentCount,
                'permit_today'   => $permitCount,
                'absent_today'   => $absentCount,
            ],
            'isTeacher'        => $isTeacher,
            'weeklyChartData'  => $weeklyChart,
            'monthlyChartData' => $monthlyChart,
            'yearlyChartData'  => $yearlyChart,
        ]);
    }

    private function formatChartData($data, $groupBy, $periods, $unit)
    {
        $formattedData = [
            'labels'  => [],
            'present' => [],
            'permit'  => [],
            'absent'  => [],
        ];

        for ($i = $periods - 1; $i >= 0; $i--) {
            $date = now()->sub($unit, $i);
            $key  = ($unit == 'month') ? $date->month : $date->day;

            $formattedData['labels'][] = ($unit == 'month') ? $date->format('M') : $date->format('D, d');

            $formattedData['present'][] = $data->where($groupBy, $key)->where('status', 'Present')->sum('count');
            $formattedData['permit'][]  = $data->where($groupBy, $key)->whereIn('status', ['Permit', 'Sick'])->sum('count');
            $formattedData['absent'][]  = $data->where($groupBy, $key)->where('status', 'Absent')->sum('count');
        }

        return $formattedData;
    }
}