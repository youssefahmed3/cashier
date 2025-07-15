using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Shift.Core.Interfaces.Repositories;
using Shift.Infrastructure.Data;

namespace Shift.Infrastructure.Repositories
{
    public class ShiftRepository : GenericRepository<Core.Entities.Shift, long>, IShiftRepository

    {
        public ShiftRepository(ShiftDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<Core.Entities.Shift?> GetActiveShiftAsync(long branchId)
        {
            return await _dbSet.FirstOrDefaultAsync(s => s.IsActive &&
                                                   s.BranchId == branchId);          
        }

        public async Task<IEnumerable<Core.Entities.Shift>> GetShiftsByBranchAsync(long branchId, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = _dbSet.Where(s => s.BranchId == branchId);

            if (fromDate.HasValue)
                query = query.Where(s => s.StartTime >= fromDate.Value);
            if (toDate.HasValue)
                query = query.Where(s => s.StartTime <= toDate.Value);

            return await query.Include(s => s.DrawerLogs).ToListAsync();
        }

        public async Task<Core.Entities.Shift?> GetShiftWithDrawerLogsAsync(long shiftId)
        {
            return await _dbSet.Include(s => s.DrawerLogs).FirstOrDefaultAsync( s => s.Id == shiftId);
        }
    }
}
