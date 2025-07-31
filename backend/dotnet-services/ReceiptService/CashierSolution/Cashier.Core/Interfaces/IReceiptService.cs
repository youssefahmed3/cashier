using Microsoft.AspNetCore.Http;

namespace Cashier.Core.Interfaces
{
    public interface IReceiptService
    {
        Task SendPdfWithReceiptAsync(IFormFile file, string email);
    }
}
