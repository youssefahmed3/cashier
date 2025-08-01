using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using Reporting.Core.Entities;
using Reporting.Core.Interfaces;
using Reporting.Infrastructure.Data;
using System.Globalization;


namespace Reporting.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportingController : ControllerBase
    {
        private readonly OrderDbContext _context;
        private readonly IOrderApiService _orderApiService;

        // Constructor to initialize both dependencies
        public ReportingController(OrderDbContext context, IOrderApiService orderApiService)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _orderApiService = orderApiService ?? throw new ArgumentNullException(nameof(orderApiService));
        }

        [HttpPost("SyncExternalOrders")]
        public async Task<IActionResult> SyncExternalOrders()
        {
            var externalOrders = await _orderApiService.GetAllOrdersAsync();

            // Map OrderDto to Order
            var orders = externalOrders.Select(dto => new Order
            {
                Id = dto.Id,
                CreatedAt = dto.CreatedAt,
                CompletedAt = dto.CompletedAt,
                Status = dto.Status,
                Ammount = dto.Ammount,
                method = dto.method,
                transactionId = dto.transactionId,
                referance = dto.referance,
                orderId = dto.orderId,
                branchId = dto.branchId,
                shiftId = dto.shiftId
            }).ToList();

            // Optional: Remove existing orders with same Ids to avoid duplicates
            var existingIds = orders.Select(o => o.Id).ToList();
            var existingOrders = await _context.Set<Order>().Where(o => existingIds.Contains(o.Id)).ToListAsync();
            _context.Set<Order>().RemoveRange(existingOrders);

            // Add new orders
            await _context.Set<Order>().AddRangeAsync(orders);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Orders synced successfully", Count = orders.Count });
        }

        //GET: api/reporting/DailySalesByBranch
        [HttpGet("DailySalesByBranch/{branchId}")]
        public async Task<IActionResult> GetDailySalesByBranch(int branchId)
        {
            var dailySales = await _context.Orders
                .Where(o => o.branchId == branchId)
                .GroupBy(o => EF.Functions.DateDiffDay(DateTime.MinValue, o.CreatedAt))
                .Select(g => new
                {
                    Date = DateTime.MinValue.AddDays(g.Key),
                    BranchId = branchId,
                    TotalSum = g.Sum(o => o.Ammount)
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            return Ok(dailySales);
        }

        // GET: api/reporting/WeeklySalesByBranch
        [HttpGet("WeeklySalesByBranch/{branchId}")]
        public async Task<IActionResult> GetWeeklySalesByBranch(int branchId)
        {
            var orders = await _context.Set<Order>()
                .Where(o => o.branchId == branchId)
                .ToListAsync();
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
                    BranchId = branchId,
                    TotalSum = g.Sum(o => o.Ammount)
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Week)
                .ToList();
            return Ok(weeklySales);
        }

        // GET: api/reporting/MonthlySalesByBranch
        [HttpGet("MonthlySalesByBranch/{branchId}")]
        public async Task<IActionResult> GetMonthlySalesByBranch(int branchId)
        {
            var monthlySales = await _context.Set<Order>()
                .Where(o => o.branchId == branchId)
                .GroupBy(o => new
                {
                    o.CreatedAt.Year,
                    o.CreatedAt.Month
                })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    BranchId = branchId,
                    TotalSum = g.Sum(o => o.Ammount)
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToListAsync();
            return Ok(monthlySales);
        }

        // GET: api/reporting/MonthlySalesByBranchExport
        [HttpGet("ExportMonthlySalesByBranchToExcel/{branchId}")]
        public async Task<IActionResult> ExportMonthlySalesByBranchToExcel(int branchId)
        {
            var monthlySales = await _context.Set<Order>()
                .Where(o => o.branchId == branchId)
                .GroupBy(o => new
                {
                    o.CreatedAt.Year,
                    o.CreatedAt.Month
                })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    BranchId = branchId,
                    TotalSum = g.Sum(o => o.Ammount)
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToListAsync();
            ExcelPackage.License.SetNonCommercialOrganization("My Noncommercial organization");
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("MonthlySalesByBranch");
            // Add headers
            worksheet.Cells[1, 1].Value = "Year";
            worksheet.Cells[1, 2].Value = "Month";
            worksheet.Cells[1, 3].Value = "BranchId";
            worksheet.Cells[1, 4].Value = "TotalSum";
            // Add data
            for (int i = 0; i < monthlySales.Count; i++)
            {
                worksheet.Cells[i + 2, 1].Value = monthlySales[i].Year;
                worksheet.Cells[i + 2, 2].Value = monthlySales[i].Month;
                worksheet.Cells[i + 2, 3].Value = monthlySales[i].BranchId;
                worksheet.Cells[i + 2, 4].Value = monthlySales[i].TotalSum;
            }
            var stream = new MemoryStream(package.GetAsByteArray());
            stream.Position = 0;
            return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "MonthlySalesByBranch.xlsx");
        }
    }
}
