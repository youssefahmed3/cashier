using Order.Core.Entities;
using Order.Core.Enums;
using Order.Core.Interfaces.Repositories;
using Order.Core.Interfaces.Strategies;
using Shared.DTOS;

public class CashPaymentStrategy : IPaymentStrategy
{
    private readonly IUnitOfWork _unitOfWork;

    public CashPaymentStrategy(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public PaymentMethod SupportedPaymentMethod => PaymentMethod.Cash;

    public async Task<ResultDto<Payment>> ProcessPaymentAsync(PaymentRequestDto paymentRequestDto)
    {
        try
        {
            // TODO: Validate cashier's shift

            var shiftId = 1;
            var cashierId = 1;

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

            // Use UpdateStatusOrderAsync method here
            var updateSuccess = await _unitOfWork.Orders.UpdateStatusOrderAsync(paymentRequestDto.OrderId, OrderStatus.Completed);
            if (!updateSuccess)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ResultDto<Payment>.Failure("Failed to update order status.");
            }

            await _unitOfWork.SaveChangesAsync();

            // TODO: Log Drawer IN and update inventory, shift balance if needed

            await _unitOfWork.CommitTransactionAsync();

            return ResultDto<Payment>.Success(payment);
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            return ResultDto<Payment>.Failure("Payment processing failed: " + ex.Message);
        }
    }

    public async Task<ResultDto<Payment>> RefundPaymentAsync(long paymentId, decimal amount)
    {
        try
        {
            //TODO: I think i should validate before start Transaction 
            await _unitOfWork.BeginTransactionAsync();

            var originalPayment = await _unitOfWork.PaymentRepo.GetByIdAsync(paymentId);
            if (originalPayment == null || (originalPayment != null && originalPayment.OrderId == null))
                return ResultDto<Payment>.Failure("Original payment not found or related order not found");

            var order = await _unitOfWork.Orders.GetByIdAsync(originalPayment.OrderId.Value);
            if(order.Status == OrderStatus.Refunded || order.Status == OrderStatus.PartiallyRefunded)
                return ResultDto<Payment>.Failure("related order does not has refund");


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

            // Calculate total paid after refund
            decimal totalPaid = (await _unitOfWork.PaymentRepo.GetPaymentByOrderIdAsync(originalPayment.OrderId.Value))
                                .Sum(p => p.Amount);

            OrderStatus newStatus = totalPaid == 0 ? OrderStatus.Refunded : OrderStatus.PartiallyRefunded;
            var updateSuccess = await _unitOfWork.Orders.UpdateStatusOrderAsync(originalPayment.OrderId.Value, newStatus);
            if (!updateSuccess)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ResultDto<Payment>.Failure("Failed to update order status.");
            }

            // TODO: Log Drawer Cash out and update inventory!!, shift balance if needed

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            return ResultDto<Payment>.Success(refundPayment);
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            return ResultDto<Payment>.Failure($"Cash refund failed: {ex.Message}");
        }
    }
}
