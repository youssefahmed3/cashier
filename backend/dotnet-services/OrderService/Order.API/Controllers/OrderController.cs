using Microsoft.AspNetCore.Mvc;
using Order.Core.Entities;
using Order.Core.Enums;
using Order.Core.Interfaces.Services;
using Shared.DTOS;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Order.API.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService<OrderDto, long, ResultDto<OrderDto>> _orderService;

        public OrderController(IOrderService<OrderDto, long, ResultDto<OrderDto>> orderService)
        {
            _orderService = orderService;
        }

        // GET: api/<OrderController>
        //[HttpGet]
        //public IActionResult Get()
        //{
        //    return _orderService.
        //}

        // GET api/<OrderController>/5
        [HttpGet("{orderId}")]
        public async Task<IActionResult> Get(long orderId)
        {
            var result = await _orderService.GetOrderByIdAsync(orderId);

            if (!result.IsSuccess)
                return NotFound(result.Error);

            return Ok(result.Value);
        }

        // POST api/<OrderController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] OrderDto orderDto)
        {
            var result = await _orderService.CreateOrderAsync(orderDto);

            if (!result.IsSuccess)
                return NotFound(result.Error);

            return Ok(result.Value);
        }

        // PUT api/<OrderController>/5
        [HttpPut("{orderId}")]
        public async Task<IActionResult> Put(long orderId, string status)
        {
            var result = await _orderService.UpdateOrderStatusAsync(orderId, status);

            if (!result.IsSuccess)
                return NotFound(result.Error);

            return Ok(result.Value);

        }

        //// DELETE api/<OrderController>/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
