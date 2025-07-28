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
    public class PaymentEventPublisher : IPaymentEventPublisher
    {
        private readonly IMessagePublisher _messagePublisher;

        public PaymentEventPublisher(IMessagePublisher messagePublisher)
        {
            _messagePublisher = messagePublisher;
        }

        //TODO: Should i publish event to reflect stock after payment or refund for that order
        public async Task<ResultDto<bool>> PublishPaymentEventsAsync(Payment payment, PaymentRequestDto request, int shiftId)
        {
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
            var drawerResult = await PublishEventSafelyAsync(drawerLogEvent);
            if (!drawerResult.IsSuccess)
            {
                return ResultDto<bool>.Failure("One or more events failed to publish.");
            }

            return ResultDto<bool>.Success(true);

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

            var drawerResult = await PublishEventSafelyAsync(drawerLogEvent);
            if (!drawerResult.IsSuccess)
            {
                return ResultDto<bool>.Failure("One or more events failed to publish.");
            }

            return ResultDto<bool>.Success(true);

        }

        private async Task<ResultDto<bool>> PublishEventSafelyAsync<T>(T message) where T : class
        {
            try
            {
                await _messagePublisher.PublishAsync(message);
                return ResultDto<bool>.Success(true);
            }
            catch(Exception ex)
            {
                return ResultDto<bool>.Failure($"Failed to publish event of type {typeof(T).Name} because {ex}");
            }
        }
    }
}
