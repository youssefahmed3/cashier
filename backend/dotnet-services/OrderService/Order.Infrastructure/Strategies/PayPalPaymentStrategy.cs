using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Order.Core.Entities;
using Order.Core.Enums;
using Order.Core.Interfaces.Repositories;
using Order.Core.Interfaces.Strategies;
using Shared.DTOS;

namespace Order.Infrastructure.Strategies
{
    //TODO: handle cases where a PayPal transaction succeeds but subsequent local transaction(s) fail.
    //TODO: Integrate with PayPal for payment 
    public class PayPalPaymentStrategy : IPaymentStrategy
    {
        private readonly IUnitOfWork _unitOfWork;

        public PayPalPaymentStrategy(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public PaymentMethod SupportedPaymentMethod => PaymentMethod.PayPal;

        public async Task<ResultDto<Payment>> ProcessPaymentAsync(PaymentRequestDto paymentRequestDto)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();

                // Call PayPal API (mocked here)
                var transactionId = await ProcessPayPalPaymentAsync(paymentRequestDto);

                var payment = new Payment
                {
                    OrderId = paymentRequestDto.OrderId,
                    Amount = paymentRequestDto.Amount,
                    Method = PaymentMethod.PayPal,
                    Status = PaymentStatus.Completed,
                    BranchId = paymentRequestDto.BranchId,
                    TransactionId = transactionId,
                    CreatedAt = DateTime.UtcNow,
                    CompletedAt = DateTime.UtcNow,
                    Reference = paymentRequestDto.Reference
                };

                await _unitOfWork.PaymentRepo.AddAsync(payment);
                await _unitOfWork.SaveChangesAsync();

                // Update order status to Completed
                bool updated = await _unitOfWork.Orders.UpdateStatusOrderAsync(paymentRequestDto.OrderId, OrderStatus.Completed);
                if (!updated)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return ResultDto<Payment>.Failure("Failed to update order status.");
                }

                await _unitOfWork.CommitTransactionAsync();

                return ResultDto<Payment>.Success(payment);
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ResultDto<Payment>.Failure($"PayPal payment failed: {ex.Message}");
            }
        }

        public async Task<ResultDto<Payment>> RefundPaymentAsync(long paymentId, decimal amount)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var originalPayment = await _unitOfWork.PaymentRepo.GetByIdAsync(paymentId);
                if (originalPayment == null || (originalPayment != null && originalPayment.OrderId == null))
                    return ResultDto<Payment>.Failure("Original payment not found or related order not found");

                var order = await _unitOfWork.Orders.GetByIdAsync(originalPayment.OrderId.Value);
                if (order.Status == OrderStatus.Refunded || order.Status == OrderStatus.PartiallyRefunded)
                    return ResultDto<Payment>.Failure("related order does not has refund");

                if (amount <= 0 || amount > originalPayment.Amount)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return ResultDto<Payment>.Failure("Invalid refund amount.");
                }

                // Process PayPal refund (mocked)
                var refundTransactionId = await ProcessPayPalRefundAsync(originalPayment.TransactionId, amount);

                var refundPayment = new Payment
                {
                   
                    OrderId = originalPayment.OrderId,
                    Amount = -amount,
                    Method = PaymentMethod.PayPal,
                    Status = PaymentStatus.Refunded,
                    BranchId = originalPayment.BranchId,
                    TransactionId = refundTransactionId,
                    CreatedAt = DateTime.UtcNow,
                    CompletedAt = DateTime.UtcNow,
                    Reference = $"Refund for Payment #{originalPayment.Id}"
                };

                await _unitOfWork.PaymentRepo.AddAsync(refundPayment);
                await _unitOfWork.SaveChangesAsync();

                // Update order status based on remaining payments
                var payments = await _unitOfWork.PaymentRepo.GetPaymentByOrderIdAsync(originalPayment.OrderId.Value);
                var totalPaid = payments.Sum(p => p.Amount);

                OrderStatus newStatus = totalPaid == 0 ? OrderStatus.Refunded : OrderStatus.PartiallyRefunded;
                bool updated = await _unitOfWork.Orders.UpdateStatusOrderAsync(originalPayment.OrderId.Value, newStatus);

                if (!updated)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return ResultDto<Payment>.Failure("Failed to update order status.");
                }

                await _unitOfWork.CommitTransactionAsync();

                return ResultDto<Payment>.Success(refundPayment);
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ResultDto<Payment>.Failure($"PayPal refund failed: {ex.Message}");
            }
        }

        // Mock PayPal payment method
        private async Task<string> ProcessPayPalPaymentAsync(PaymentRequestDto request)
        {
            await Task.Delay(100);
            return $"PP_{Guid.NewGuid().ToString("N")[..10]}";
        }

        // Mock PayPal refund method
        private async Task<string> ProcessPayPalRefundAsync(string originalTransactionId, decimal amount)
        {
            await Task.Delay(100);
            return $"RF_{Guid.NewGuid().ToString("N")[..10]}";
        }

    }
}
