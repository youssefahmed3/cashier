using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Order.Core.Entities;
using Order.Core.Interfaces.Repositories;
using Order.Core.Interfaces.Services;
using Shared.DTOS;
using Shared.Events;

namespace Order.Services.Services
{
    public class PaymentEventPublisher : IPaymentEventPublisher
    {
        private readonly IMessagePublisher _messagePublisher;
        private readonly IUnitOfWork _unitOfWork;

        public PaymentEventPublisher(IMessagePublisher messagePublisher, IUnitOfWork unitOfWork)
        {
            _messagePublisher = messagePublisher;
            _unitOfWork = unitOfWork;
        }

        public async Task<ResultDto<bool>> PublishPaymentEventsAsync(Payment payment, PaymentRequestDto request, int shiftId)
        {
            var results = new List<ResultDto<bool>>();

            var drawerLogEvent = new DrawerLogEvent
            {
                BranchId = request.BranchId,
                ShiftId = shiftId,
                TransactionType = "Sale",
                Amount = request.Amount,
                Reference = $"Cash payment for Order #{request.OrderId}",
                CreatedAt = DateTime.UtcNow,
                PaymentId = payment.Id,
            };
            var drawerResult = await _messagePublisher.PublishEventSafelyAsync(drawerLogEvent);
            results.Add(drawerResult);

            var stockResult = await PublishStockDecreaseEventAsync(request.OrderId, request.BranchId);
            results.Add(stockResult);

            if (results.Any(r => !r.IsSuccess))
            {
                var failedEvents = results.Where(r => !r.IsSuccess).Select(r => r.Error);
                return ResultDto<bool>.Failure($"One or more events failed to publish: {string.Join(", ", failedEvents)}");
            }

            return ResultDto<bool>.Success(true);

        }
        private async Task<ResultDto<bool>> PublishStockDecreaseEventAsync(long orderId, long branchId)
        {
            try
            {
                // Get order with items to determine what stock to decrease
                var order = await _unitOfWork.Orders.GetOrderWithItemsAsync(orderId);
                if (order == null)
                {
                    return ResultDto<bool>.Failure($"Order {orderId} not found for stock decrease");
                }

                var stockEvent = new StockUpdateEvent
                {
                    EventType = "StockDecrease",
                    BranchId = branchId,
                    Items = order.OrderItems.Select(item => new StockUpdateItem
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Qty,
                    }).ToList(),
                    CreatedAt = DateTime.UtcNow,
                    Reference = $"Stock decrease for completed Order #{orderId}",
                };

                return await _messagePublisher.PublishEventSafelyAsync(stockEvent, "stock-decrease");
            }
            catch (Exception ex)
            {
                return ResultDto<bool>.Failure($"Failed to publish stock decrease event: {ex.Message}");
            }
        }
    }
}
