using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shared.DTOS;
using Shift.Core.Interfaces.Services;

namespace Shift.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShiftController : ControllerBase
    {
        private readonly IShiftService _shiftService;

        public ShiftController(IShiftService shiftService)
        {
            _shiftService = shiftService;
        }

        [HttpPost("start")]
        public async Task<IActionResult> StartShift([FromBody] StartShiftDto request)
        {
            var result = await _shiftService.StartShiftAsync(request);

            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(new { error = result.Error });
        }

        [HttpPost("end")]
        public async Task<IActionResult> EndShift([FromBody] EndShiftDto request)
        {
            var result = await _shiftService.EndShiftAsync(request);

            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(new { error = result.Error });
        }

        [HttpGet("active/{branchId}")]
        public async Task<IActionResult> GetActiveShift(long branchId)
        {
            var result = await _shiftService.GetActiveShiftAsync(branchId);

            if (result.IsSuccess)
                return Ok(result.Value);

            return NotFound(new { error = result.Error });
        }

        [HttpGet("branch/{branchId}")]
        public async Task<IActionResult> GetShiftsByBranch(long branchId, [FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null)
        {
            var result = await _shiftService.GetShiftsByBranchAsync(branchId, fromDate, toDate);

            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(new { error = result.Error });
        }

        [HttpGet("{shiftId}/drawer-logs")]
        public async Task<IActionResult> GetDrawerLogs(long shiftId)
        {
            var result = await _shiftService.GetDrawerLogsByShiftAsync(shiftId);

            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(new { error = result.Error });
        }

        [HttpPost("/drawer-log")]
        public async Task<IActionResult> AddDrawerLog(DrawerLogDto logRequest)
        {
            var result = await _shiftService.AddDrawerLogAsync(logRequest);

            if (result.IsSuccess)
                return Ok();

            return BadRequest(new { error = result.Error });
        }
    }


}
