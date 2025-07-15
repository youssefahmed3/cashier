using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shift.Core.Interfaces.Repositories
{
    public interface IShiftRepository : IGenericRepository<Entities.Shift, long>
    {
        Task<Entities.Shift?> GetActiveShiftAsync(long branchId);
        Task<IEnumerable<Entities.Shift>> GetShiftsByBranchAsync(long branchId, DateTime? fromDate = null, DateTime? toDate = null);
        Task<Entities.Shift?> GetShiftWithDrawerLogsAsync(long shiftId);
    }
}
