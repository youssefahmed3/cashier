using Microsoft.AspNetCore.Mvc;
using Order.Core.Interfaces.Services;
using Order.Infrastructure.Services;
using Shared.PaymentProviders.Paymob;

namespace Order.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymobCallbackController : Controller
    {
        private readonly IPaymobCallbackService _callbackService;
        private readonly ILogger<PaymobCallbackController> _logger;

        public PaymobCallbackController(IPaymobCallbackService callbackService, ILogger<PaymobCallbackController> logger)
        {
            _callbackService = callbackService;
            _logger = logger;
        }

        [HttpPost("transaction-processed")]
        public async Task<IActionResult> ProcessTransactionCallback([FromBody] PaymobCallbackDto callback, [FromQuery] string hmac)
        {
            try
            {
                _logger.LogInformation($"Received transaction callback for transaction ID: {callback?.Obj?.Id}");

                var result = await _callbackService.ProcessTransactionCallbackAsync(callback, hmac);

                if (result.IsSuccess)
                {
                    return Ok(new { message = "Callback processed successfully" });
                }

                _logger.LogError($"Failed to process callback: {result.Error}");
                return BadRequest(new { error = result.Error });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in transaction callback");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }
    }
}
