using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Order.Core.Entities;

namespace Order.Core.Interfaces.Repositories
{
    public interface IPaymentRepository : IGenericRepository<Payment, Guid>
    {
        Task<IEnumerable<Payment>> GetPaymentByOrderIdAsync(Guid orderId);
        Task<IEnumerable<Payment>> GetPaymentByBranchIdAsync(Guid branchId, DateTime? fromDate = null, DateTime? toDate = null);

    }
}
