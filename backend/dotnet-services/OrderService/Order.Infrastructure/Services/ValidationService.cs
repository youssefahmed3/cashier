using System.Net;
using MassTransit;
using Microsoft.Extensions.Logging;
using Shared.DTOS;
using Shared.Requests;
using ValidationResult = Shared.Requests.ValidationResult;


namespace Order.Infrastructure.Services
{
    public class ValidationService
    {
        private readonly IRequestClient<ValidateBranchRequest> _branchClient;
        private readonly IRequestClient<ValidateInventoryRequest> _inventoryClient;
        private readonly IRequestClient<ValidateShiftRequest> _shiftClient;
        private readonly ILogger<ValidationService> _logger;

        public ValidationService(
            IRequestClient<ValidateBranchRequest> branchClient,
            IRequestClient<ValidateInventoryRequest> inventoryClient,
            IRequestClient<ValidateShiftRequest> shiftClient,
            ILogger<ValidationService> logger)
        {
            _branchClient = branchClient;
            _inventoryClient = inventoryClient;
            _shiftClient = shiftClient;
            _logger = logger;
        }

        public async Task<ResultDto<bool>> ValidateBranchAsync(long branchId)
        {
            try
            {
                var response = await _branchClient.GetResponse<ValidationResponse>(new ValidateBranchRequest { BranchId = branchId });
                return ResultDto<bool>.Success(response.Message.IsValid);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Branch validation failed");
                return ResultDto<bool>.Failure($"Branch validation failed: {ex.Message}");
            }
        }

        public async Task<ResultDto<bool>> ValidateInventoryAsync(List<OrderItemDto> items)
        {
            try
            {
                var response = await _inventoryClient.GetResponse<ValidationResponse>(new ValidateInventoryRequest { Items = items });
                return ResultDto<bool>.Success(response.Message.IsValid);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Inventory validation failed");
                return ResultDto<bool>.Failure($"Inventory validation failed: {ex.Message}");
            }
        }

        public async Task<ResultDto<bool>> ValidateShiftAsync(long shiftId, long userId)
        {
            try
            {
                var response = await _shiftClient.GetResponse<ValidationResponse>(new ValidateShiftRequest { ShiftId = shiftId, UserId = userId });
                return ResultDto<bool>.Success(response.Message.IsValid);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Shift validation failed");
                return ResultDto<bool>.Failure($"Shift validation failed: {ex.Message}");
            }
        }

        public async Task<ResultDto<ValidationResult>> ValidateOrderAsync(OrderDto orderDto)
        {
         
            var branchTask = ValidateBranchAsync(orderDto.BranchId);
            var inventoryTask = ValidateInventoryAsync(orderDto.Items);
            var shiftTask = ValidateShiftAsync(orderDto.ShiftId, orderDto.UserId!.Value);

            await Task.WhenAll(branchTask, inventoryTask, shiftTask);

            var errors = new List<string>();

            if (!branchTask.Result.IsSuccess || !branchTask.Result.Value)
                errors.Add($"Branch validation failed {branchTask.Result.Error}");

            if (!inventoryTask.Result.IsSuccess || !inventoryTask.Result.Value)
                errors.Add($"Inventory validation failed {inventoryTask.Result.Error}");

            if (!shiftTask.Result.IsSuccess || !shiftTask.Result.Value)
                errors.Add($"Shift validation failed {shiftTask.Result.Error}");

            var result = new ValidationResult
            {
                IsValid = errors.Count == 0,
                Errors = errors,
                BranchValid = branchTask.Result.Value,
                InventoryValid = inventoryTask.Result.Value,
                ShiftValid = shiftTask.Result.Value
            };

            return ResultDto<ValidationResult>.Success(result);
        }
    }
}

