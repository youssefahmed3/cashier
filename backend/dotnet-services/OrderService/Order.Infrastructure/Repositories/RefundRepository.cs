using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Order.Core.Entities;
using Order.Core.Interfaces.Repositories;
using Order.Infrastructure.Data;
using Shared.DTOS;
using Order.Core.Enums;

namespace Order.Infrastructure.Repositories
{
    public class RefundRepository : GenericRepository<Refund, long>, IRefundRepository
    {
        private readonly IGenericRepository<RefundItem, long> _refundItemRepo;
        private readonly IGenericRepository<OrderItem, long> _orderItemRepo;
        public RefundRepository(
           OrderDbContext dbContext,
           IGenericRepository<RefundItem, long> refundItemRepo,
           IGenericRepository<OrderItem, long> orderItemRepo) : base(dbContext)
        {
            _refundItemRepo = refundItemRepo;
            _orderItemRepo = orderItemRepo;
        }
        public async Task<Refund> CreateRefundWithItemsAsync(RefundRequestDto refundRequest, decimal refundAmount, long paymentId)
        {
            var refund = new Refund
            {
                OrderId = refundRequest.OrderId,
                PaymentId = paymentId,
                BranchId = refundRequest.BranchId,
                ShiftId  = refundRequest.ShiftId,
                Amount = refundAmount,
                Reason = refundRequest.Reason,
                Status = TransactionStatus.Completed,
                CreatedAt = DateTime.UtcNow,
                CompletedAt = DateTime.UtcNow,
            };

            await AddAsync(refund);
            await _dbContext.SaveChangesAsync();

            foreach (var itemDto in refundRequest.Items)
            {
                var orderItem = await _orderItemRepo.GetByIdAsync(itemDto.OrderItemId);
                if (orderItem != null)
                {
                    var refundItem = new RefundItem
                    {
                        Name     = orderItem.Name,
                        Quantity = itemDto.Quantity,
                        UnitPrice = orderItem.UnitPrice,
                        RefundId = refund.Id,
                        OrderItemId = itemDto.OrderItemId,

                    };
                    await _refundItemRepo.AddAsync(refundItem);
                }
            }

            await _dbContext.SaveChangesAsync();
            return refund;
        }

        public async Task<decimal> GetRefundedQuantityForOrderItemAsync(long orderItemId)
        {
            return await _dbContext.Set<RefundItem>()
                .Where(ri => ri.OrderItemId == orderItemId)
                .SumAsync(ri => ri.Quantity);
        }

        public async Task<IEnumerable<Refund>> GetRefundsByOrderIdAsync(long orderId)
        {
            return await _dbSet
                .Where(r => r.OrderId == orderId)
                .Include(r => r.RefundItems)
                .ToListAsync();
        }

        public async Task<decimal> GetTotalRefundedAmountAsync(long orderId)
        {
            return await _dbSet
                .Where(r => r.OrderId == orderId && r.Status == TransactionStatus.Completed)
                .SumAsync(r => r.Amount);
        }
    }
}
