using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Order.Core.Entities;
using Order.Core.Enums;
using Order.Core.Interfaces.Repositories;
using Order.Core.Interfaces.Services;
using Order.Core.Interfaces.Strategies;
using Order.Services.Helpers;
using Shared.DTOS;

namespace Order.Services.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly Dictionary<PaymentMethod, IPaymentStrategy> _paymentStrategies;
        private readonly IValidationService _validationService;
        private readonly IUserContextService _userContextService;
        private readonly IMapper _mapper;

        public PaymentService(IUnitOfWork unitOfWork, IEnumerable<IPaymentStrategy> paymentStrategies, IMapper mapper, IValidationService validationService, IUserContextService userContextService)
        {
            _unitOfWork = unitOfWork;
            _paymentStrategies = paymentStrategies.ToDictionary(s => s.SupportedPaymentMethod);
            _mapper = mapper;
            _validationService = validationService;
            _userContextService = userContextService;
        }

        public async Task<ResultDto<PaymentDto>> ProcessPaymentAsync(PaymentRequestDto request)
        {
            try
            {
                var order = await _unitOfWork.Orders.GetByIdAsync(request.OrderId);
                if (order == null)
                {
                    return ResultDto<PaymentDto>.Failure("Order not found.");
                }
                if (order.BranchId != request.BranchId)
                {
                    return ResultDto<PaymentDto>.Failure("Order not found for that branch");
                }

                if (!EnumHelper.TryParseEnum<PaymentMethod>(request.PaymentMethod, out var method))

                {
                    return ResultDto<PaymentDto>.Failure($"Payment method {request.PaymentMethod} is not supported.");
                }
                var userId =  _userContextService.GetUserId();
                var branchResult = await _validationService.ValidateBranchAsync(request.BranchId);
                var shiftResult = await _validationService.ValidateShiftAsync(request.ShiftId, userId);
                if (!branchResult.IsSuccess  ||
                    !shiftResult.IsSuccess)
                {
                    return ResultDto<PaymentDto>.Failure($"Validation check failed for reference data (BranchId: {request.BranchId}, ShiftId: {request.ShiftId}, UserId: {userId})");

                }

                var strategy = _paymentStrategies[method];
                var result = await strategy.ProcessPaymentAsync(request);
              
                if (!result.IsSuccess)
                    throw new InvalidOperationException(result.Error);

                var resultDto = _mapper.Map<PaymentDto>(result.Value);

                return ResultDto<PaymentDto>.Success(resultDto);

            }
            catch (Exception ex)
            {
                return ResultDto<PaymentDto>.Failure($"Payment processing failed: {ex.Message}");

            }
        }
        public async Task<ResultDto<IEnumerable<PaymentDto>>> GetPaymentsByOrderIdAsync(long orderId)
        {
            try
            {
                var payments = await _unitOfWork.PaymentRepo.GetPaymentByOrderIdAsync(orderId);
                var paymentDtos = _mapper.Map<IEnumerable<PaymentDto>>(payments);
                return ResultDto<IEnumerable<PaymentDto>>.Success(paymentDtos);
            }
            catch (Exception ex)
            {
                return ResultDto<IEnumerable<PaymentDto>>.Failure($"Error retrieving payments: {ex.Message}");
            }

        }

        public async Task<ResultDto<PaymentDto>> GetPaymentByIdAsync(long paymentId)
        {
            try
            {
                var payment = await _unitOfWork.PaymentRepo.GetByIdAsync(paymentId);
                if (payment == null)
                {
                    return ResultDto<PaymentDto>.Failure("Payment not found.");
                }

                var paymentDto = _mapper.Map<PaymentDto>(payment);
                return ResultDto<PaymentDto>.Success(paymentDto);
            }
            catch (Exception ex)
            {
                return ResultDto<PaymentDto>.Failure($"Error retrieving payment: {ex.Message}");
            }
        }

        public async Task<ResultDto<IEnumerable<PaymentDto>>> GetAllPaymentsAsync(DateTime? fromDate = null, DateTime? toDate = null)
        {
            try
            {
                var payments = await _unitOfWork.PaymentRepo.GetAllCompletedOrRefundedAsync(fromDate, toDate);
                var paymentDtos = _mapper.Map<IEnumerable<PaymentDto>>(payments);
                return ResultDto<IEnumerable<PaymentDto>>.Success(paymentDtos);
            }
            catch (Exception ex)
            {
                return ResultDto<IEnumerable<PaymentDto>>.Failure($"Error retrieving all payments: {ex.Message}");
            }
        }
        public async Task<ResultDto<IEnumerable<PaymentDto>>> GetPaymentsByBranchIdAsync(long branchId, DateTime? fromDate = null, DateTime? toDate = null)
        {
            try
            {
                var payments = await _unitOfWork.PaymentRepo.GetCompletedOrRefundedByBranchIdAsync(branchId, fromDate, toDate);
                var paymentDtos = _mapper.Map<IEnumerable<PaymentDto>>(payments);
                return ResultDto<IEnumerable<PaymentDto>>.Success(paymentDtos);
            }
            catch (Exception ex)
            {
                return ResultDto<IEnumerable<PaymentDto>>.Failure($"Error retrieving payments for branch: {ex.Message}");
            }
        }


    }
}
