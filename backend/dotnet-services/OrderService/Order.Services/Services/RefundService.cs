using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Order.Core.Entities;
using Order.Core.Enums;
using Order.Core.Interfaces.Repositories;
using Order.Core.Interfaces.Services;
using Order.Core.Interfaces.Strategies;
using Shared.DTOS;


namespace Order.Services.Services
{
    public class RefundService : IRefundService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly Dictionary<PaymentMethod, IPaymentStrategy> _paymentStrategies;
        private readonly IRefundEventPublisher _refundEventPublisher; 
        private readonly IMapper _mapper;

        public RefundService(IUnitOfWork unitOfWork,
            IEnumerable<IPaymentStrategy> paymentStrategies,
            IRefundEventPublisher refundEventPublisher,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _paymentStrategies = paymentStrategies.ToDictionary(s => s.SupportedPaymentMethod);
            _refundEventPublisher = refundEventPublisher;
            _mapper = mapper;
        }
        public async Task<ResultDto<RefundDto>> ProcessRefundAsync(RefundRequestDto refundRequest)
        {
            //TODO: validate Branch and ShiftId
            try
            {
                var order = await _unitOfWork.Orders.GetByIdAsync(refundRequest.OrderId);
                if (order == null)
                    return ResultDto<RefundDto>.Failure("Order not found.");

                var validationResult = await ValidateRefundAsync(order, refundRequest.Items);
                if (!validationResult.IsSuccess)
                    return ResultDto<RefundDto>.Failure(validationResult.Error);

                var refundAmount = await CalculateRefundAmountAsync(refundRequest.Items);

                var originalPayment = await GetOriginalPaymentAsync(refundRequest.OrderId);
                if (originalPayment == null)
                    return ResultDto<RefundDto>.Failure("No completed payment found for the order.");

                var totalRefunded = await _unitOfWork.Refunds.GetTotalRefundedAmountAsync(refundRequest.OrderId);
                if (totalRefunded + refundAmount > originalPayment.Amount)
                    return ResultDto<RefundDto>.Failure("Refund amount exceeds available refundable amount.");

                if (!_paymentStrategies.TryGetValue(originalPayment.Method, out var strategy))
                    return ResultDto<RefundDto>.Failure("Unsupported payment method for refund.");

                var result = await strategy.RefundPaymentAsync(originalPayment, order, refundAmount);
                if (!result.IsSuccess)
                    return ResultDto<RefundDto>.Failure(result.Error);

                var refund = await _unitOfWork.Refunds.CreateRefundWithItemsAsync(refundRequest, refundAmount, originalPayment.Id);
                await _unitOfWork.SaveChangesAsync();

                //Publish stock restock event
               var stockRestockResult = await _refundEventPublisher.PublishStockRestockEventsAsync(refund, originalPayment, refund.RefundItems.ToList());


                var resultDto = _mapper.Map<RefundDto>(refund);
                return ResultDto<RefundDto>.Success(resultDto);
            }
            catch (Exception ex)
            {
                return ResultDto<RefundDto>.Failure($"Refund processing failed: {ex.Message}");
            }
        }

        private async Task<ResultDto<string>> ValidateRefundAsync(SalesOrder order, List<RefundItemDto> items)
        {
            if (order.Status == OrderStatus.Canceled)
                return ResultDto<string>.Failure("Cannot refund cancelled or unpaid order.");

            foreach (var item in items)
            {
                var orderItem = await _unitOfWork.OrderItems.GetByIdAsync(item.OrderItemId);
                if (orderItem == null || orderItem.OrderId != order.Id)
                    return ResultDto<string>.Failure($"Order item {item.OrderItemId} not found or doesn't belong to this order.");

                var alreadyRefundedQty = await _unitOfWork.Refunds.GetRefundedQuantityForOrderItemAsync(item.OrderItemId);
                if (item.Quantity <= 0 || (alreadyRefundedQty + item.Quantity) > orderItem.Qty)
                    return ResultDto<string>.Failure($"Invalid refund quantity for item {item.OrderItemId}.");
            }
            return ResultDto<string>.Success("Validation passed");
        }

        private async Task<decimal> CalculateRefundAmountAsync(List<RefundItemDto> items)
        {
            decimal totalAmount = 0;
            foreach (var item in items)
            {
                var orderItem = await _unitOfWork.OrderItems.GetByIdAsync(item.OrderItemId);
                if (orderItem != null)
                {
                    totalAmount += orderItem.UnitPrice * item.Quantity;
                }
            }
            return totalAmount;
        }

        private async Task<Payment?> GetOriginalPaymentAsync(long orderId)
        {
            var payments = await _unitOfWork.PaymentRepo.GetPaymentByOrderIdAsync(orderId);
            return payments
                .Where(p => p.Status == TransactionStatus.Completed)
                .OrderByDescending(p => p.CompletedAt ?? p.CreatedAt)
                .FirstOrDefault();
        }

        public async Task<ResultDto<decimal>> GetOrderRefundedAmountAsync(long orderId)
        {
            try
            {
                var totalRefunded = await _unitOfWork.Refunds.GetTotalRefundedAmountAsync(orderId);
                return ResultDto<decimal>.Success(totalRefunded);
            }
            catch (Exception ex)
            {
                return ResultDto<decimal>.Failure($"Failed to calculate refunded amount: {ex.Message}");
            }
        }
    }
}

