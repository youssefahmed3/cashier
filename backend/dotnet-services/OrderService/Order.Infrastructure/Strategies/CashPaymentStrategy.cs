using Order.Core.Entities;
using Order.Core.Enums;
using Order.Core.Interfaces.Repositories;
using Order.Core.Interfaces.Services;
using Order.Core.Interfaces.Strategies;
using Shared.DTOS;
using Shared.Events;

public class CashPaymentStrategy : IPaymentStrategy
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPaymentEventPublisher _eventPublisher;

    public CashPaymentStrategy(IUnitOfWork unitOfWork, IPaymentEventPublisher eventPublisher)
    {
        _unitOfWork = unitOfWork;
        _eventPublisher = eventPublisher;
    }

    public PaymentMethod SupportedPaymentMethod => PaymentMethod.Cash;

    public async Task<ResultDto<Payment>> ProcessPaymentAsync(PaymentRequestDto paymentRequestDto)
    {
        // TODO: Call the shiftService to get the shiftId 
        var shiftId = 1;   

        try
        {
            await _unitOfWork.BeginTransactionAsync();

            var payment = new Payment
            {
                OrderId = paymentRequestDto.OrderId,
                BranchId = paymentRequestDto.BranchId,
                ShiftId = shiftId,
                Method = PaymentMethod.Cash,
                Amount = paymentRequestDto.Amount,
                Status = PaymentStatus.Completed,
                CreatedAt = DateTime.UtcNow,
                CompletedAt = DateTime.UtcNow,
                Reference = paymentRequestDto.Reference
            };

            await _unitOfWork.PaymentRepo.AddAsync(payment);

            var updateSuccess = await _unitOfWork.Orders.UpdateStatusOrderAsync(paymentRequestDto.OrderId, OrderStatus.Completed);
            if (!updateSuccess)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ResultDto<Payment>.Failure("Failed to update order status.");
            }

            await _unitOfWork.SaveChangesAsync();

            // Fire and forget Payment event publishing
            var eventResult = await _eventPublisher.PublishPaymentEventsAsync(payment, paymentRequestDto, shiftId);

            await _unitOfWork.CommitTransactionAsync();

            return ResultDto<Payment>.Success(payment);
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            return ResultDto<Payment>.Failure($"Payment processing failed: {ex.Message}");
        }
    }

    public async Task<ResultDto<Payment>> RefundPaymentAsync(long paymentId, decimal amount)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();

            var originalPayment = await _unitOfWork.PaymentRepo.GetByIdAsync(paymentId);
            if (originalPayment == null || originalPayment.OrderId == null)
                return ResultDto<Payment>.Failure("Original payment or related order not found.");

            var order = await _unitOfWork.Orders.GetByIdAsync(originalPayment.OrderId.Value);
            if (order.Status == OrderStatus.Refunded || order.Status == OrderStatus.PartiallyRefunded)
                return ResultDto<Payment>.Failure("Related order already refunded.");

            if (amount <= 0 || amount > originalPayment.Amount)
                return ResultDto<Payment>.Failure("Invalid refund amount.");

            var refundPayment = new Payment
            {
                OrderId = originalPayment.OrderId,
                BranchId = originalPayment.BranchId,
                ShiftId = originalPayment.ShiftId,
                Method = originalPayment.Method,
                Amount = -amount,
                Status = PaymentStatus.Refunded,
                CreatedAt = DateTime.UtcNow,
                CompletedAt = DateTime.UtcNow,
                Reference = $"Refund for Payment #{originalPayment.Id}",
                TransactionId = originalPayment.TransactionId
            };

            await _unitOfWork.PaymentRepo.AddAsync(refundPayment);

            var totalPaid = (await _unitOfWork.PaymentRepo.GetPaymentByOrderIdAsync(originalPayment.OrderId.Value))
                                .Sum(p => p.Amount);

            var newStatus = totalPaid == 0 ? OrderStatus.Refunded : OrderStatus.PartiallyRefunded;
            var updateSuccess = await _unitOfWork.Orders.UpdateStatusOrderAsync(originalPayment.OrderId.Value, newStatus);
            if (!updateSuccess)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ResultDto<Payment>.Failure("Failed to update order status.");
            }

            await _unitOfWork.SaveChangesAsync();

            // Fire and forget refund event publishing
            var eventResult = await _eventPublisher.PublishRefundEventsAsync(refundPayment, originalPayment, amount);

            await _unitOfWork.CommitTransactionAsync();

            return ResultDto<Payment>.Success(refundPayment);
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            return ResultDto<Payment>.Failure($"Refund failed: {ex.Message}");
        }
    }
}
