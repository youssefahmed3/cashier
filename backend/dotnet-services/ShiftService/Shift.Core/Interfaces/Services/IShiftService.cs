using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shared.DTOS;

namespace Shift.Core.Interfaces.Services
{
    public interface IShiftService
    {
        Task<ResultDto<ShiftDto>> StartShiftAsync(StartShiftDto request);
        Task<ResultDto<ShiftDto>> EndShiftAsync(EndShiftDto request);
        Task<ResultDto<ShiftDto>> GetActiveShiftAsync(long branchId);
        Task<ResultDto<ShiftDto>> GetShiftByIdAsync(long shiftId);
        Task<ResultDto<IEnumerable<ShiftDto>>> GetShiftsByBranchAsync(long branchId, DateTime? fromDate = null, DateTime? toDate = null);
        Task<ResultDto<bool>> AddDrawerLogAsync(DrawerLogDto log);
        Task<ResultDto<IEnumerable<DrawerLogDto>>> GetDrawerLogsByShiftAsync(long shiftId);
    }
}
