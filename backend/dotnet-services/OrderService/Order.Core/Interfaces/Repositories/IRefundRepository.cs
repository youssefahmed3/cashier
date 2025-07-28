using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Order.Core.Entities;
using Shared.DTOS;

namespace Order.Core.Interfaces.Repositories
{
    public interface IRefundRepository : IGenericRepository<Refund, long>
    {
        Task<IEnumerable<Refund>> GetRefundsByOrderIdAsync(long orderId);
        Task<decimal> GetTotalRefundedAmountAsync(long orderId);
        Task<Refund> CreateRefundWithItemsAsync(RefundRequestDto refundRequest, decimal refundAmount, long paymentId);
        Task<decimal> GetRefundedQuantityForOrderItemAsync(long orderItemId);

    }
}
