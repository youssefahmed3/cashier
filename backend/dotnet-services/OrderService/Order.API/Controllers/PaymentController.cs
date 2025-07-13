using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Order.Core.Interfaces.Services;
using Shared.DTOS;

namespace Order.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("process")]
        public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequestDto request)
        {
            var result = await _paymentService.ProcessPaymentAsync(request);

            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(new { error = result.Error });
        }

        [HttpPost("refund")]
        public async Task<IActionResult> RefundPayment(RefundRequest refundRequest)
        {
            var result = await _paymentService.RefundPaymentAsync(refundRequest.PaymentId, refundRequest.Amount);

            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(new { error = result.Error });
        }

        [HttpGet("{paymentId}")]
        public async Task<IActionResult> GetPayment(long paymentId)
        {
            var result = await _paymentService.GetPaymentByIdAsync(paymentId);

            if (result.IsSuccess)
                return Ok(result.Value);

            return NotFound(new { error = result.Error });
        }

        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetPaymentsByOrder(long orderId)
        {
            var result = await _paymentService.GetPaymentsByOrderIdAsync(orderId);

            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(new { error = result.Error });
        }
    }
}
