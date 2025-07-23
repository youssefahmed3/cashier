using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Order.Core.Entities;
using Order.Core.Enums;

namespace Order.Core.Interfaces.Repositories
{
    public interface IOrderRepository : IGenericRepository<SalesOrder,long>
    {
        Task<IEnumerable<SalesOrder>> GetOrdersByBranchAsync(long branchId, DateTime? fromDate = null, DateTime? toDate = null);
        Task<bool> UpdateStatusOrderAsync(long orderId, OrderStatus newStatus);
        Task<SalesOrder?> GetOrderWithItemsAsync(long orderId);

    }
}
