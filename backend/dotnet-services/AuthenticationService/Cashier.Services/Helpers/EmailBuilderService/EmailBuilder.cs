namespace Cashier.Services.Helpers.EmailBuilderService
{
    public static class EmailBuilder
    {
        public static string BuildRegistrationEmail(string registrationLink)
        {
            var title = "🎉 Complete Your Registration";
            var body = $@"
                <p>Thank you for your interest in joining us!</p>
                <p>Click the button below to complete your account registration.</p>
                <div class='cta-buttons'>
                    <a href='{registrationLink}'>Complete Registration</a>
                </div>";
            return WrapWithLayout(title, body);
        }

        public static string Build2FAEmail(string code)
        {
            var title = "🔐 Your 2FA Code";
            var body = $@"
                <p>Use the following verification code to complete your login:</p>
                <div class='code-box'>{code}</div>
                <p style='margin-top: 15px;'>This code is valid for 10 minutes.</p>";
            return WrapWithLayout(title, body);
        }

        public static string BuildResetPasswordEmail(string code)
        {
            var title = "🔑 Reset Your Password";
            var body = $@"
                <p>Use the code below to reset your password:</p>
                <div class='code-box'>{code}</div>
                <p style='margin-top: 15px;'>This code is valid for 15 minutes.</p>";
            return WrapWithLayout(title, body);
        }

        private static string WrapWithLayout(string headerTitle, string contentHtml)
        {
            return $@"
<html>
<head>
    <style>
        body {{
            font-family: 'Segoe UI', Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }}
        .email-wrapper {{
            width: 100%;
            padding: 30px 0;
            background-color: #f4f4f4;
        }}
        .email-container {{
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        }}
        .email-header {{
            background-color: #0066cc;
            color: white;
            text-align: center;
            padding: 20px;
        }}
        .email-header h1 {{
            margin: 0;
            font-size: 24px;
        }}
        .email-body {{
            padding: 30px;
        }}
        .email-body p {{
            margin: 0 0 15px;
        }}
        .cta-buttons {{
            margin-top: 20px;
        }}
        .cta-buttons a {{
            display: inline-block;
            background-color: #0066cc;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 6px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }}
        .cta-buttons a:hover {{
            background-color: #0056b3;
        }}
        .code-box {{
            font-size: 24px;
            font-weight: bold;
            background-color: #f0f0f0;
            padding: 10px 20px;
            display: inline-block;
            border-radius: 6px;
            letter-spacing: 4px;
        }}
        .email-footer {{
            background-color: #f0f0f0;
            text-align: center;
            font-size: 13px;
            color: #777;
            padding: 20px;
        }}
    </style>
</head>
<body>
    <div class='email-wrapper'>
        <div class='email-container'>
            <div class='email-header'>
                <h1>{headerTitle}</h1>
            </div>
            <div class='email-body'>
                {contentHtml}
            </div>
            <div class='email-footer'>
                <p>If you didn’t request this, please ignore this email.</p>
            </div>
        </div>
    </div>
</body>
</html>";
        }
    }
}
