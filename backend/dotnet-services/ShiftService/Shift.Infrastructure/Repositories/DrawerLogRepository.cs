using Microsoft.EntityFrameworkCore;
using Shift.Core.Entities;
using Shift.Core.Interfaces.Repositories;
using Shift.Infrastructure.Data;

namespace Shift.Infrastructure.Repositories
{
    public class DrawerLogRepository : GenericRepository<DrawerLog, long>, IDrawerLogRepository
    {
        public DrawerLogRepository(ShiftDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IEnumerable<DrawerLog>> GetDrawerLogsByShiftAsync(long shiftId)
        {
            return await _dbSet.Where(d => d.ShiftId == shiftId)
                               .OrderBy(d => d.CreatedAt)
                               .ToListAsync();
        }
    }
}
