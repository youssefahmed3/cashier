using Cashier.Core.Interfaces;
using Cashier.Services.Helpers.EmailBuilderService;
using Cashier.Services.Helpers.EmailService;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Cashier.Services.Services
{
    public class ReceiptService(IEmailSender _sender, IConfiguration _config) : IReceiptService
    {
        public async Task SendPdfWithReceiptAsync(IFormFile file, string email)
        {
            if (file == null || file.Length == 0 || Path.GetExtension(file.FileName).ToLower() != ".pdf")
                throw new ArgumentException("Invalid PDF file.");

            var subject = "🧾 Your Receipt";
            var body = EmailBuilder.BuildEmail();

            using var memory = new MemoryStream();
            await file.CopyToAsync(memory);
            var fileBytes = memory.ToArray();

            var fromEmail = _config["MailSettings:Email"];
            var fromName = _config["MailSettings:DisplayName"];

            var mimeMessage = MimeMessageBuilder.CreateMessage(
                fromEmail!,
                fromName!,
                email,
                subject,
                body,
                file.FileName,
                fileBytes
            );

            await _sender.SendEmailAsync(new()
            {
                To = email,
                Subject = subject,
                Body = body,
                RawMessage = mimeMessage
            });
        }
    }
}
