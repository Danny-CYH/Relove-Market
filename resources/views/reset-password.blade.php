<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - Relove Market</title>
    <style>
        /* 样式 */
    </style>
</head>

<body>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f8f7; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="500" cellpadding="0" cellspacing="0"
                    style="background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <tr>
                        <td align="center">
                            <!-- Logo -->
                            <div style="margin-bottom: 30px;">
                                <span style="font-size: 24px; font-weight: bold; color: #059669;">🌿 Relove
                                    Market</span>
                            </div>

                            <h1 style="font-size: 22px; color: #1f2937; margin-bottom: 16px;">
                                Reset Your Password
                            </h1>

                            <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                                Hello {{ $user->name }},
                            </p>

                            <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                                You are receiving this email because we received a password reset request for your
                                account.
                            </p>

                            <!-- ✅ Reset Button -->
                            <a href="{{ $resetUrl }}"
                                style="display: inline-block; background: #059669; color: #ffffff; padding: 14px 40px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 24px 0;">
                                Reset Password
                            </a>

                            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                                This password reset link will expire in 60 minutes.
                            </p>

                            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                                If you did not request a password reset, no further action is required.
                            </p>

                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

                            <p style="color: #9ca3af; font-size: 12px; margin-bottom: 8px;">
                                Regards,<br>
                                <strong style="color: #059669;">Relove Market</strong>
                            </p>

                            <p style="color: #9ca3af; font-size: 12px;">
                                If you're having trouble clicking the button, copy and paste the URL below:
                            </p>
                            <p style="color: #9ca3af; font-size: 12px; word-break: break-all;">
                                {{ $resetUrl }}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
