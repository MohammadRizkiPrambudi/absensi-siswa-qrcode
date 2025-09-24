@component('mail::message')
    # {{ $greeting ?? '' }}

    @foreach ($introLines as $line)
        {{ $line }}
    @endforeach

    @isset($actionText)
        @component('mail::button', [
            'url' => $actionUrl,
            'color' => $level === 'success' ? 'green' : ($level === 'error' ? 'red' : 'blue'),
        ])
            {{ $actionText }}
        @endcomponent
    @endisset

    @foreach ($outroLines as $line)
        {{ $line }}
    @endforeach

    <br>
    Terima Kasih, <br>
    Smart Absensi

    @slot('subcopy')
        Jika tombol di atas tidak berfungsi, salin dan tempel URL berikut ke browser Anda:
        [{{ $actionUrl }}]({{ $actionUrl }})
    @endslot
@endcomponent
