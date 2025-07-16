using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shift.Core.Entities;

namespace Shift.Core.Interfaces.Repositories
{
    public interface IDrawerLogRepository : IGenericRepository<DrawerLog, long>
    {
        Task<IEnumerable<DrawerLog>> GetDrawerLogsByShiftAsync(long shiftId);

    }
}
