using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Order.Core.Entities;
using Order.Core.Enums;
using Order.Core.Interfaces.Repositories;
using Order.Infrastructure.Data;

namespace Order.Infrastructure.Repositories
{
    public class OrderRepository : GenericRepository<SalesOrder, Guid>, IOrderRepository
    {
        public OrderRepository(OrderDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<IEnumerable<SalesOrder>> GetOrdersByBranchAsync(Guid branchId, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = _dbSet.Where(o => o.BranchId == branchId);
            
            if(fromDate.HasValue)
                query = query.Where(o => o.CreatedAt >= fromDate.Value);

            if(toDate.HasValue)
                query = query.Where(o => o.CreatedAt <= toDate.Value);

            return await query.Include(o => o.OrderItems).AsNoTracking().ToListAsync();
        }
        public async Task<bool> UpdateStatusOrderAsync(Guid orderId, OrderStatus newStatus)
        {
            var order = await _dbSet.FindAsync(orderId);
            if (order is null) return false;

            order.Status = newStatus;
            order.UpdatedAt = DateTime.UtcNow;
            return true;

        }

        public async Task<SalesOrder?> GetOrderWithItemsAsync(Guid orderId)
        {
            return await _dbSet.Include(o =>o.OrderItems).FirstOrDefaultAsync( o => o.Id == orderId);
        }
    }
}
