using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Order.Core.Interfaces.Repositories;
using Order.Core.Interfaces.Services;
using Order.Services.Services;
using Shared.DTOS;

namespace Order.API.Controllers
{
    [Authorize]

    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IRefundService _refundService;

        public PaymentController(IPaymentService paymentService, IRefundService refundService)
        {
            _paymentService = paymentService;
            _refundService  = refundService;
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
        public async Task<IActionResult> RefundPayment(RefundRequestDto refundRequest)
        {
            var result = await _refundService.ProcessRefundAsync(refundRequest);

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

        [HttpGet("all")]
        public async Task<IActionResult> GetAllPayments([FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null)
        {
            var result = await _paymentService.GetAllPaymentsAsync(fromDate, toDate);

            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(new { error = result.Error });
        }

        [HttpGet("branch/{branchId}")]
        public async Task<IActionResult> GetPaymentsByBranch(long branchId, [FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null)
        {
            var result = await _paymentService.GetPaymentsByBranchIdAsync(branchId, fromDate, toDate);

            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(new { error = result.Error });
        }
    }
}
