using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Order.Core.Entities;

namespace Order.Core.Interfaces.Repositories
{
    public interface IPaymentRepository : IGenericRepository<Payment, long>
    {
        Task<IEnumerable<Payment>> GetPaymentByOrderIdAsync(long orderId);
        Task<IEnumerable<Payment>> GetPaymentByBranchIdAsync(long branchId, DateTime? fromDate = null, DateTime? toDate = null);

    }
}
