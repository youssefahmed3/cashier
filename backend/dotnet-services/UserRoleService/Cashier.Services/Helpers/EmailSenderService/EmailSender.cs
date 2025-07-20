namespace Cashier.Services.Helpers.EmailService
{
    public class EmailSender(IConfiguration _configuration) : IEmailSender
    {
        private readonly string? _email = _configuration["MailSettings:Email"];
        private readonly string? _name = _configuration["MailSettings:DisplayName"];
        private readonly string? _host = _configuration["MailSettings:Host"];
        private readonly string? _password = _configuration["MailSettings:Password"];
        private readonly int _port = int.Parse((_configuration["MailSettings:Port"]!));

        public async Task SendEmailAsync(Email email)
        {
            var mail = new MimeMessage
            {
                Sender = MailboxAddress.Parse(_email),
                Subject = email.Subject
            };
            mail.To.Add(MailboxAddress.Parse(email.To));
            mail.From.Add(new MailboxAddress(_name, _email));
            var builder = new BodyBuilder
            {
                HtmlBody = email.Body
            };
            mail.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            smtp.ServerCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true;
            smtp.CheckCertificateRevocation = false;

            try
            {
                await smtp.ConnectAsync(_host, _port, SecureSocketOptions.SslOnConnect);
                await smtp.AuthenticateAsync(_email, _password);
                await smtp.SendAsync(mail);
                await smtp.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to send email: {ex.Message}", ex);
            }
        }
    }
}
