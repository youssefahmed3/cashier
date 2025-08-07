using MimeKit;

namespace Cashier.Shared.DTOS
{
    public class Email
    {
        public string To { get; set; } = default!;
        public string Subject { get; set; } = default!;
        public string Body { get; set; } = default!;
        public MimeMessage? RawMessage { get; set; }
    }
}
