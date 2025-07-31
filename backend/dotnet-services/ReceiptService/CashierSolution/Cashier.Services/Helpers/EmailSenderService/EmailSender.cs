using Cashier.Services.Helpers.EmailService;
using Cashier.Shared.DTOS;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;

public class EmailSender(IConfiguration _configuration) : IEmailSender
{
    private readonly string? _email = _configuration["MailSettings:Email"];
    private readonly string? _password = _configuration["MailSettings:Password"];
    private readonly string? _host = _configuration["MailSettings:Host"];
    private readonly int _port = int.Parse(_configuration["MailSettings:Port"]!);

    public async Task SendEmailAsync(Email email)
    {
        if (email.RawMessage is null)
            throw new ArgumentNullException(nameof(email.RawMessage), "RawMessage must be provided.");

        using var smtp = new SmtpClient();
        smtp.ServerCertificateValidationCallback = (s, c, ch, e) => true;
        smtp.CheckCertificateRevocation = false;

        try
        {
            await smtp.ConnectAsync(_host, _port, SecureSocketOptions.SslOnConnect);
            await smtp.AuthenticateAsync(_email, _password);
            await smtp.SendAsync(email.RawMessage);
            await smtp.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to send email: {ex.Message}", ex);
        }
    }
}
