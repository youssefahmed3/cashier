using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Reporting.core.Entities;
using Reporting.Infrastructure.Data;


namespace Reporting.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportingController : ControllerBase
    {
        private readonly StockDbContext _context;

        public ReportingController(StockDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Stock>>> GetStocks()
        {
            return Ok(await _context.Stocks.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Stock>> GetStock(int id)
        {
            var stock = await _context.Stocks.FindAsync(id);
            if (stock == null)
            {
                return NotFound();
            }
            return Ok(stock);
        }

        [HttpPost]
        public async Task<ActionResult<Stock>> CreateStock(Stock stock)
        {
            if (stock == null)
            {
                return BadRequest();
            }
            _context.Stocks.Add(stock);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetStock), new { id = stock.Id }, stock);
        }



        

    }
}
