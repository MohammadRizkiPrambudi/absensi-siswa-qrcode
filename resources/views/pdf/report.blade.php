<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Rekap Absensi</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th,
        td {
            border: 1px solid #ccc;
            padding: 6px;
            text-align: left;
        }

        th {
            background: #f0f0f0;
        }
    </style>
</head>

<body>
    <h2 style="text-align:center">Rekap Absensi Siswa</h2>
    <table>
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Siswa</th>
                <th>Kelas</th>
                <th>Mapel</th>
                <th>Status</th>
                <th>Guru</th>
            </tr>
        </thead>
        <tbody>
            @forelse($attendances as $a)
                <tr>
                    <td>{{ $a->date }}</td>
                    <td>{{ $a->student->user->name }}</td>
                    <td>{{ $a->classroom->name }}</td>
                    <td>{{ $a->subject->name }}</td>
                    <td>{{ $a->status }}</td>
                    <td>{{ $a->teacher->name ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align:center; font-style:italic">Tidak ada data absensi</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>

</html>
