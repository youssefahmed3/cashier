using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Order.Core.Enums;
using Order.Core.Interfaces.Repositories;
using Order.Core.Interfaces.Services;
using Order.Infrastructure.Settings;
using Shared.DTOS;
using Shared.PaymentProviders.Paymob;

namespace Order.Infrastructure.Services
{
    public class PaymobCallbackService : IPaymobCallbackService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly PaymobSettings _settings;
        private readonly ILogger<PaymobCallbackService> _logger;

        public PaymobCallbackService(
            IUnitOfWork unitOfWork,
            IOptions<PaymobSettings> settings,
            ILogger<PaymobCallbackService> logger)
        {
            _unitOfWork = unitOfWork;
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task<ResultDto<bool>> ProcessTransactionCallbackAsync(PaymobCallbackDto callback, string hmac)
        {
            try
            {
                // Validate HMAC
                //var dataString = CreateHmacDataString(callback);
                //if (!_hmacService.ValidateHmac(dataString, hmac, _settings.HmacSecret))
                //{
                //    _logger.LogWarning("HMAC validation failed for transaction callback");
                //    return ResultDto<bool>.Failure("HMAC validation failed");
                //}

                // Extract order information from special reference
                var specialReference = callback.Obj.Order.Merchant_Order_Id;
                if (string.IsNullOrEmpty(specialReference))
                {
                    _logger.LogError("Special reference is missing from callback");
                    return ResultDto<bool>.Failure("Special reference missing");
                }

                // Parse special reference to get order ID
                var orderIdStr = specialReference.Split('-')[0];
                if (!long.TryParse(orderIdStr, out long orderId))
                {
                    _logger.LogError($"Invalid order ID in special reference: {specialReference}");
                    return ResultDto<bool>.Failure("Invalid order ID in special reference");
                }

                await _unitOfWork.BeginTransactionAsync();

                // Update payment record
                var payment = await _unitOfWork.PaymentRepo.GetPaymentByTransactionIdAsync(specialReference);
                if (payment == null)
                {
                    _logger.LogError($"Payment not found for transaction: {specialReference}");
                    await _unitOfWork.RollbackTransactionAsync();
                    return ResultDto<bool>.Failure("Payment not found");
                }

                // Determine new status based on callback
                var (newPaymentStatus, newOrderStatus) = DetermineStatuses(callback.Obj);

                // Update payment status
                payment.Status = newPaymentStatus;
                payment.TransactionId = callback.Obj.Id.ToString();

                if (callback.Obj.Success && !callback.Obj.Pending)
                {
                    payment.CompletedAt = DateTime.UtcNow;
                }

                _unitOfWork.PaymentRepo.Update(payment);

                // Update order status
                bool orderUpdated = await _unitOfWork.Orders.UpdateStatusOrderAsync(orderId, newOrderStatus);
                if (!orderUpdated)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return ResultDto<bool>.Failure("Failed to update order status");
                }

                await _unitOfWork.SaveChangesAsync();
                await _unitOfWork.CommitTransactionAsync();

                _logger.LogInformation($"Successfully processed callback for order {orderId}, status: {newOrderStatus}");
                return ResultDto<bool>.Success(true);
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync();
                _logger.LogError(ex, "Error processing transaction callback");
                return ResultDto<bool>.Failure($"Error processing callback: {ex.Message}");
            }
        }

        private(TransactionStatus PaymentStatus, OrderStatus OrderStatus) DetermineStatuses(PaymobTransactionObj transaction)
        {
            if (transaction.Is_Refunded)
                return (TransactionStatus.Refunded, OrderStatus.Refunded);

            if (transaction.Is_Voided)
                return (TransactionStatus.Cancelled, OrderStatus.Canceled);

            if (transaction.Success && !transaction.Pending)
                return (TransactionStatus.Completed, OrderStatus.Completed);

            if (transaction.Pending)
                return (TransactionStatus.Pending, OrderStatus.OnHold);

            // Failed or unknown
            return (TransactionStatus.Failed, OrderStatus.Canceled); 
        }

    }
}
