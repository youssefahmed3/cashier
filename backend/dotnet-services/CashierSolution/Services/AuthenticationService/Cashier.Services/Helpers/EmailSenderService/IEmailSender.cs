namespace Cashier.Services.Helpers.EmailService
{
    public interface IEmailSender
    {
        public Task SendEmailAsync(Email email);
    }
}
