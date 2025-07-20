using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Order.Core.Entities;
using Order.Core.Enums;
using Order.Core.Interfaces.Repositories;
using Order.Core.Interfaces.Services;
using Order.Core.Interfaces.Strategies;
using Order.Infrastructure.Settings;
using Shared.DTOS;
using Shared.PaymentProviders.Paymob;

namespace Order.Infrastructure.Strategies
{
    //TODO: handle cases where a Paymob transaction succeeds but subsequent local transaction(s) fail.
    //TODO: Integrate with Paymob for payment 
    public class PaymobPaymentStrategy : IPaymentStrategy
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPaymobService _paymobService;
        private readonly PaymobSettings _settings;


        public PaymobPaymentStrategy(IUnitOfWork unitOfWork, IPaymobService paymobService, IOptions<PaymobSettings> settings)
        {
            _unitOfWork = unitOfWork;
            _paymobService = paymobService;
            _settings = settings.Value;
        }
        public PaymentMethod SupportedPaymentMethod => PaymentMethod.Paymob;

        public async Task<ResultDto<Payment>> ProcessPaymentAsync(PaymentRequestDto paymentRequestDto)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();

                // Call Paymob API
                var (transactionId, clientSecret) = await ProcessPaymobPaymentAsync(paymentRequestDto);

                var payment = new Payment
                {
                    OrderId = paymentRequestDto.OrderId,
                    Amount = paymentRequestDto.Amount,
                    Method = PaymentMethod.Paymob,
                    Status = PaymentStatus.Completed,
                    BranchId = paymentRequestDto.BranchId,
                    TransactionId = transactionId,
                    CreatedAt = DateTime.UtcNow,
                    CompletedAt = DateTime.UtcNow,
                    Reference = clientSecret,
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
                return ResultDto<Payment>.Failure($"Paymob payment failed: {ex.Message}");
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

                // Process Paymob refund (mocked)
                var refundTransactionId = await ProcessPaymobRefundAsync(originalPayment.TransactionId, amount);

                var refundPayment = new Payment
                {
                   
                    OrderId = originalPayment.OrderId,
                    Amount = -amount,
                    Method = PaymentMethod.Paymob,
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
                return ResultDto<Payment>.Failure($"Paymob refund failed: {ex.Message}");
            }
        }

        //Paymob payment method
        private async Task<(string specialReference, string clientSecert)> ProcessPaymobPaymentAsync(PaymentRequestDto request)
        {
            // TODO: fetch actual customer billing data from request or database
            var billingData = new PaymobBillingData
            {
                First_Name = "Market_OS",
                Last_Name = "Project",
                Email = "marketOS@gmail.com",
                Phone_Number = "011XXXXXXXX",
            };

            var intentionRequest = new PaymobIntentionRequest
            {
                Amount = request.Amount * 100, // to convert it to cents 
                Currency = _settings.Currency,
                Billing_Data = billingData,
                Extras = new PaymobExtras
                {
                    Order_Id = request.OrderId
                },
                Payment_Methods = [_settings.CardIntegrationId,],
                Notification_Url = _settings.NotificationUrl,
                Redirection_Url = _settings.RedirectionUrl,
                Expiration = _settings.ExpirationSeconds,
                Special_Reference = $"{request.OrderId}-{request.PaymentMethod}-{request.CashierId}-{request.BranchId}-{request.CustomerId}-{DateTime.UtcNow.Ticks}",

            };

            var result = await _paymobService.CreateIntentionAsync(intentionRequest);

            if (!result.IsSuccess)
                throw new InvalidOperationException(result.Error);

          


            return (result.Value.Special_Reference, result.Value.Client_Secret);
        }


        // Paymob refund method
        private async Task<string> ProcessPaymobRefundAsync(string specialReference, decimal amount)
        {
            var transactionResult = await _paymobService.GetTransactionIdAsync(specialReference.ToString());

            if (!transactionResult.IsSuccess)
                throw new InvalidOperationException(transactionResult.Error);

            var refundResult = await _paymobService.RefundPaymentAsync(transactionResult.Value.Id, amount * 100); ;
            if (!refundResult.IsSuccess)
                throw new InvalidOperationException(refundResult.Error);

            return refundResult.Value.Id.ToString();
        }

    }
}
