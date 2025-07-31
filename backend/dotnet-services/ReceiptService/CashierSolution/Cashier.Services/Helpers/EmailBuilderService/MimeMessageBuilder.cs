using MimeKit;

namespace Cashier.Services.Helpers.EmailBuilderService
{
    internal class MimeMessageBuilder
    {
        public static MimeMessage CreateMessage(string fromEmail, string fromName, string toEmail, string subject, string htmlBody, string? attachmentName = null, byte[]? attachmentBytes = null)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, fromEmail));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            var builder = new BodyBuilder { HtmlBody = htmlBody };

            if (!string.IsNullOrWhiteSpace(attachmentName) && attachmentBytes != null)
            {
                builder.Attachments.Add(attachmentName, attachmentBytes, new ContentType("application", "pdf"));
            }

            message.Body = builder.ToMessageBody();
            return message;
        }
    }
}
