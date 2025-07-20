using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Order.Core.Entities;
using Order.Core.Interfaces.Repositories;
using Order.Infrastructure.Data;

namespace Order.Infrastructure.Repositories
{
    public class PaymentRepository : GenericRepository<Payment, long>, IPaymentRepository
    {
        public PaymentRepository(OrderDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IEnumerable<Payment>> GetPaymentByBranchIdAsync(long branchId, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = _dbSet.Where(p => p.BranchId == branchId);

            if (fromDate.HasValue)
                query = query.Where(p => p.CreatedAt >= fromDate.Value);
            if (toDate.HasValue)
                query = query.Where(p => p.CreatedAt <= toDate.Value);

            return await query.ToListAsync();

        }

        // as we support refund or when the Payment Retries so the one order may has many records in the payment table
        public async Task<IEnumerable<Payment>> GetPaymentByOrderIdAsync(long orderId)
        {
            return await _dbSet.Where(o  => o.OrderId == orderId).ToListAsync();
        }
    }
}
