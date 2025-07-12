using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Order.Core.Interfaces.Services;
using Shared.DTOS;

namespace Order.API.Controllers
{
    [Route("api/items")]
    [ApiController]
    public class OrderItemController : ControllerBase
    {
        private readonly IOrderItemService _orderItemService;

        public OrderItemController(IOrderItemService orderItemService)
        {
            _orderItemService = orderItemService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll([FromQuery] Guid orderId, [FromQuery] Guid branchId)
        {
            var result = await _orderItemService.GetAllAsync(orderId, branchId);
            if (result.IsSuccess)
                return Ok(result.Value);
            return BadRequest(new { error = result.Error });
        }

        [HttpGet]
        public async Task<IActionResult> GetById([FromQuery] Guid orderId, [FromQuery] Guid itemId, [FromQuery] Guid branchId)
        {
            var result = await _orderItemService.GetByIdAsync(itemId, orderId, branchId);
            if (result.IsSuccess)
                return Ok(result.Value);
            return NotFound(new { error = result.Error });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromQuery] Guid branchId, [FromBody] OrderItemDto dto)
        {
            var result = await _orderItemService.CreateAsync(dto, branchId);
            if (result.IsSuccess)
                return CreatedAtAction(nameof(GetById), new { dto.OrderId, itemId = result.Value?.Id, branchId }, result.Value);

            return BadRequest(new { error = result.Error });
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromQuery] Guid branchId, Guid itemId,[FromBody] OrderItemDto dto)
        {
            var result = await _orderItemService.UpdateAsync(branchId, dto);
            if (result.IsSuccess)
                return NoContent();

            return BadRequest(new { error = result.Error });
        }

        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] Guid orderId, Guid itemId, [FromQuery] Guid branchId)
        {
            var result = await _orderItemService.DeleteAsync(itemId, orderId, branchId);
            if (result.IsSuccess)
                return NoContent();

            return NotFound(new { error = result.Error });
        }

    }
}
