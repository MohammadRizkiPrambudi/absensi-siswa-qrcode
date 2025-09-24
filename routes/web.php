<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TeacherSubjectClassroomController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

Route::get('/', [AttendanceController::class, 'dailyScanPage'])->name('daily-scan');
Route::get('/attendances/daily-scan', [AttendanceController::class, 'dailyScanPage'])->name('attendances.daily-scan');
Route::post('/attendances/daily-scan', [AttendanceController::class, 'dailyScanStore']);

Route::get('/dashboard', DashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->group(function () {
    // Hanya admin boleh
    Route::middleware('role:admin')->group(function () {
        Route::resource('students', StudentController::class);
        Route::get('students/{student}/generate-qr', [StudentController::class, 'generateQr'])->name('students.generateQr');
        Route::resource('classrooms', ClassroomController::class);
        Route::resource('subjects', SubjectController::class);
        Route::resource('teachers', TeacherController::class);
        Route::resource('users', UserController::class);
        Route::resource('roles', RoleController::class);
        Route::resource('permissions', PermissionController::class);
        Route::resource('teacher-subject-classroom', TeacherSubjectClassroomController::class);
    });

    // Hanya guru boleh
    Route::middleware('role:teacher')->group(function () {
        Route::get('/attendances/scan', [AttendanceController::class, 'scanPage'])->name('attendances.scan');
        Route::post('/attendances/scan', [AttendanceController::class, 'scanStore'])->name('attendances.scan.store');
        Route::get('/attendances/manual/{classroom}/{subject}', [AttendanceController::class, 'manual'])->name('attendances.manual');

        Route::resource('attendances', AttendanceController::class)
            ->only(['index', 'create', 'store']); // absensi manual
    });

    Route::middleware('role:admin|teacher')->group(function () {
        Route::get('/attendances/report', [AttendanceController::class, 'report'])->name('attendances.report');
        Route::get('/attendances/report/pdf', [AttendanceController::class, 'reportPdf'])->name('attendances.report.pdf');
    });
});

require __DIR__ . '/auth.php';