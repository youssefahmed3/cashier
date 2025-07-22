using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using Reporting.core.Entities;
using Reporting.Core.Entities;
using Reporting.Infrastructure.Data;
using System.Globalization;


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

        // GET: api/reporting/DailySales
        [HttpGet("DailySales")]
        public async Task<IActionResult> GetDailySales()
        {
            var dailySales = await _context.Set<Order>()
                .GroupBy(o => o.CreatedAt.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    TotalSum = g.Sum(o => o.Total)
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            return Ok(dailySales);
        }
        // GET: api/reporting/WeeklySales
        [HttpGet("WeeklySales")]
        public async Task<IActionResult> GetWeeklySales()
        {
            var weeklySales = await _context.Set<Order>()
                .GroupBy(o => new
                {
                    Year = o.CreatedAt.Year,
                    Week = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(
                        o.CreatedAt,
                        CalendarWeekRule.FirstDay, // Specify the CalendarWeekRule
                        DayOfWeek.Monday          // Specify the first day of the week
                    )
                })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Week,
                    TotalSum = g.Sum(o => o.Total)
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Week)
                .ToListAsync();
            return Ok(weeklySales);

        }
        // GET: api/reporting/MonthlySales
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
                    TotalSum = g.Sum(o => o.Total)
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToListAsync();
            return Ok(monthlySales);
        }

        // GET: api/reporting/MonthlySalesExport
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
                    TotalSum = g.Sum(o => o.Total)
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToListAsync();

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
        
    }
}
