using Cashier.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cashier.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ReceiptController(IReceiptService _recipientService) : ControllerBase
    {
        [HttpPost("send-receipt")]
        public async Task<IActionResult> SendReceipt([FromForm] IFormFile file, [FromForm] string email)
        {
            try
            {
                await _recipientService.SendPdfWithReceiptAsync(file, email);
                return Ok("Receipt sent successfully.");
            }
            catch (Exception ex)
            {
                return Ok( new { message = ex.Message });
            }
        }
    }
}
