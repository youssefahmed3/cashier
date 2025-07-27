using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Reporting.Infrastructure.Data;

namespace Reporting.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuperReportingController : ControllerBase
    {
        private readonly OrderDbContext _context;

        public SuperReportingController(OrderDbContext context)
        {
            _context = context;
        }

        // GET: api/superreporting/GetNewTenantsMonthly
        [HttpGet("GetNewTenantsMonthly")]
        public IActionResult GetNewTenantsMonthly()
        {
            var tenants = _context.Tenants
                .GroupBy(t => new { Year = t.CreatedAt.Year, Quarter = ((t.CreatedAt.Month - 1) / 3) + 1 })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Quarter = g.Key.Quarter,
                    NewTenantsCount = g.Count()
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Quarter)
                .ToList();

            return Ok(tenants);
        }

        // GET: api/superreporting/OrdersTotalValueMonthly
        [HttpGet("OrdersTotalValueMonthly")]
        public IActionResult GetOrdersTotalValueMonthly()
        {
            var monthlyOrders = _context.Orders
                .GroupBy(o => new { o.CreatedAt.Year, o.CreatedAt.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TotalValue = g.Sum(o => o.Total)
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToList();
            return Ok(monthlyOrders);
        }
    }
}
