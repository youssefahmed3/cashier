using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shift.Core.Interfaces.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
       
        IShiftRepository ShiftRepository { get; }
        IDrawerLogRepository DrawerLogRepository { get; }
        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
