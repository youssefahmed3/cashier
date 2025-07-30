using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Order.Core.Entities;
using Order.Core.Interfaces.Services;
using Shared.DTOS;
using Shared.Events;

namespace Order.Services.Services
{
    public class RefundEventPublisher: IRefundEventPublisher
    {
        private readonly IMessagePublisher _messagePublisher;

        public RefundEventPublisher(IMessagePublisher messagePublisher)
        {
            _messagePublisher = messagePublisher;
        }

        public async Task<ResultDto<bool>> PublishRefundEventsAsync(Payment refundPayment, Payment originalPayment, decimal amount)
        {
            var drawerLogEvent = new DrawerLogEvent
            {
                BranchId = originalPayment.BranchId,
                ShiftId = originalPayment.ShiftId,
                TransactionType = "Refund",
                Amount = amount,
                Reference = $"Cash refund for Order #{originalPayment.OrderId}",
                CreatedAt = DateTime.UtcNow,
                PaymentId = refundPayment.Id,
            };

            var drawerResult = await _messagePublisher.PublishEventSafelyAsync(drawerLogEvent);
            if (!drawerResult.IsSuccess)
            {
                return ResultDto<bool>.Failure("One or more events failed to publish.");
            }

            return ResultDto<bool>.Success(true);

        }
        public async Task<ResultDto<bool>> PublishStockRestockEventsAsync(Refund refund, Payment originalPayment, List<RefundItem> refundItems)
        {
            try
            {
                var stockEvent = new StockUpdateEvent
                {
                    EventType = "StockRestock",
                    BranchId = originalPayment.BranchId,
                    OrderId = refund.OrderId,
                    RefundId = refund.Id,
                    Items = refundItems.Select(item => new StockUpdateItem
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                    }).ToList(),
                    CreatedAt = DateTime.UtcNow,
                    Reference = $"Stock restock for refund #{refund.Id} on Order #{refund.OrderId}",
                };

                return await _messagePublisher.PublishEventSafelyAsync(stockEvent, "stock.restock");
            }
            catch (Exception ex)
            {
                return ResultDto<bool>.Failure($"Failed to publish stock restock event: {ex.Message}");
            }
        }

    } 
}
