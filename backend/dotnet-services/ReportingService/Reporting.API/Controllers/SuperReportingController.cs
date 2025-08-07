using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using Reporting.Core.Entities;
using Reporting.Infrastructure.Data;
using System.Globalization;

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
        [HttpGet("GetNewTenantsQuarterly")]
        public IActionResult GetNewTenantsQuarterly()
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
                    TotalValue = g.Sum(o => o.Ammount)
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToList();
            return Ok(monthlyOrders);
        }

        // GET: api/superreporting/TotalRevenue
        [HttpGet("TotalRevenue")]
        public IActionResult GetTotalRevenue()
        {
            var totalRevenue = _context.Orders.Sum(o => o.Ammount);
            return Ok(new { TotalRevenue = totalRevenue });
        }

        // GET: api/superreporting/MonthlySales
        [HttpGet("MonthlySales")]
        public async Task<IActionResult> GetMonthlySales()
        {
            var monthlySales = await _context.Set<Order>()
                .GroupBy(o => new
                {
                    o.CreatedAt.Year,
                    o.CreatedAt.Month
                })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    TotalSum = g.Sum(o => o.Ammount)
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToListAsync();
            return Ok(monthlySales);
        }

        // GET: api/superreporting/MonthlySalesExport
        [HttpGet("ExportMonthlySalesToExcel")]
        public async Task<IActionResult> ExportMonthlySalesToExcel()
        {
            var monthlySales = await _context.Set<Order>()
                .GroupBy(o => new
                {
                    o.CreatedAt.Year,
                    o.CreatedAt.Month
                })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    TotalSum = g.Sum(o => o.Ammount)
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToListAsync();

            ExcelPackage.License.SetNonCommercialOrganization("My Noncommercial organization");
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("MonthlySales");

            // Add headers
            worksheet.Cells[1, 1].Value = "Year";
            worksheet.Cells[1, 2].Value = "Month";
            worksheet.Cells[1, 3].Value = "TotalSum";

            // Add data
            for (int i = 0; i < monthlySales.Count; i++)
            {
                worksheet.Cells[i + 2, 1].Value = monthlySales[i].Year;
                worksheet.Cells[i + 2, 2].Value = monthlySales[i].Month;
                worksheet.Cells[i + 2, 3].Value = monthlySales[i].TotalSum;
            }

            var stream = new MemoryStream(package.GetAsByteArray());
            stream.Position = 0;
            return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "MonthlySales.xlsx");
        }

        // GET: api/superreporting/WeeklySales
        [HttpGet("WeeklySales")]
        public async Task<IActionResult> GetWeeklySales()
        {
            var orders = await _context.Set<Order>().ToListAsync();

            var weeklySales = orders
                .GroupBy(o => new
                {
                    Year = o.CreatedAt.Year,
                    Week = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(
                        o.CreatedAt,
                        CalendarWeekRule.FirstDay,
                        DayOfWeek.Monday
                    )
                })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Week,
                    TotalSum = g.Sum(o => o.Ammount)
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Week)
                .ToList();

            return Ok(weeklySales);
        }

        // GET: api/superreporting/DailySales
        [HttpGet("DailySales")]
        public async Task<IActionResult> GetDailySales()
        {
            var dailySales = await _context.Set<Order>()
                .GroupBy(o => o.CreatedAt.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    TotalSum = g.Sum(o => o.Ammount)
                })
                .OrderBy(x => x.Date)
                .ToListAsync();
            return Ok(dailySales);
        }


    }
}
