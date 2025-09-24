<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Smart Absensi - Reset Password</title>
</head>

<body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px;">
    <table align="center" width="600"
        style="background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <tr>
            <td
                style="padding: 20px; text-align: center; background: #2563eb; color: #ffffff; font-size: 20px; font-weight: bold;">
                🔐 Reset Password
            </td>
        </tr>
        <tr>
            <td style="padding: 30px;">
                <p style="font-size: 16px; color: #374151;">Halo <strong>{{ $user->name }}</strong>,</p>
                <p style="font-size: 15px; color: #374151;">
                    Kami menerima permintaan untuk mereset password akun kamu.
                    Klik tombol di bawah untuk membuat password baru:
                </p>

                <p style="text-align: center; margin: 30px 0;">
                    <a href="{{ $url }}"
                        style="background: #2563eb; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                        Reset Password
                    </a>
                </p>

                <p style="font-size: 14px; color: #6b7280;">
                    Jika kamu tidak merasa meminta reset password, abaikan email ini. Link Reset ini berlaku hanya 60
                    Menit
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 15px; text-align: center; font-size: 12px; color: #9ca3af; background: #f3f4f6;">
                &copy; {{ date('Y') }} Smart Absensi. All rights reserved.
            </td>
        </tr>
    </table>
</body>

</html>
