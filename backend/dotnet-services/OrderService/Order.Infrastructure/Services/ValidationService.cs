using System.Net;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Shared.DTOS;
using Shared.Requests;
using System.Text.Json;
using Order.Core.Interfaces.Services;

namespace Order.Infrastructure.Services
{
    public class ValidationService : IValidationService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly ILogger<ValidationService> _logger;

        public ValidationService(
            IConfiguration configuration,
            HttpClient httpClient,
            ILogger<ValidationService> logger)
        {
            _configuration = configuration;
            _httpClient = httpClient;
            _logger = logger;
        } 

        public async Task<ResultDto<bool>> ValidateBranchAsync(long branchId)
        {
            var branchPath = _configuration["ServicesURLs:BranchUrl"];
            return await ValidateReferenceAsync(branchPath, $"branches/{branchId}", "branch");
        }

        public async Task<ResultDto<bool>> ValidateShiftAsync(long shiftId, long userId)
        {
            var shiftPath = _configuration["ServicesURLs:ShiftUrl"];
            return await ValidateReferenceAsync(shiftPath, $"shifts/validate/{shiftId}/{userId}", "shift");
        }

        public async Task<ResultDto<bool>> ValidateShiftAsync(long shiftId, long userId, long branchId)
        {
            var shiftPath = _configuration["ServicesURLs:ShiftUrl"];
            return await ValidateReferenceAsync(shiftPath, $"validate/{shiftId}/{userId}", "shift");
        }

        public async Task<ResultDto<bool>> ValidateCustomerAsync(long customerId)
        {
            var customerPath = _configuration["ServicesURLs:CustomerUrl"];
            return await ValidateReferenceAsync(customerPath, $"customers/{customerId}", "customer");
        }

        public async Task<ResultDto<bool>> ValidateInventoryAsync(List<OrderItemDto> items)
        {
            try
            {
                var inventoryPath = _configuration["ServicesURLs:InventoryUrl"];
                var baseUrl = _configuration["ServicesURLs:BaseUrl"];
                var url = $"{baseUrl}/{inventoryPath}/validate";

                var jsonContent = JsonSerializer.Serialize(items);
                var content = new StringContent(jsonContent, System.Text.Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(url, content);

                if (response.StatusCode == HttpStatusCode.BadRequest)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return ResultDto<bool>.Failure($"Inventory validation failed: {errorContent}");
                }

                if (!response.IsSuccessStatusCode)
                {
                    return ResultDto<bool>.Failure($"Error validating inventory: {response.StatusCode}");
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                var validationResult = JsonSerializer.Deserialize<bool>(responseContent);

                return ResultDto<bool>.Success(validationResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception validating inventory");
                return ResultDto<bool>.Failure($"Exception validating inventory: {ex.Message}");
            }
        }

        public async Task<ResultDto<ValidationResult>> ValidateOrderAsync(OrderDto orderDto)
        {
            var branchTask = ValidateBranchAsync(orderDto.BranchId);
            var inventoryTask = ValidateInventoryAsync(orderDto.Items);
            var shiftTask = ValidateShiftAsync(orderDto.ShiftId, orderDto.UserId!.Value);

            var tasks = new List<Task> { branchTask, inventoryTask, shiftTask };

            await Task.WhenAll(tasks);

            var errors = new List<string>();

            // Check branch validation
            if (!branchTask.Result.IsSuccess)
                errors.Add($"Branch validation error: {branchTask.Result.Error}");
            else if (!branchTask.Result.Value)
                errors.Add("Invalid branch ID");

            // Check inventory validation
            if (!inventoryTask.Result.IsSuccess)
                errors.Add($"Inventory validation error: {inventoryTask.Result.Error}");
            else if (!inventoryTask.Result.Value)
                errors.Add("Insufficient inventory");

            // Check shift validation
            if (!shiftTask.Result.IsSuccess)
                errors.Add($"Shift validation error: {shiftTask.Result.Error}");
            else if (!shiftTask.Result.Value)
                errors.Add("Invalid shift or user not authorized for this shift");

            var result = new ValidationResult
            {
                IsValid = errors.Count == 0,
                Errors = errors,
                BranchValid = branchTask.Result.IsSuccess && branchTask.Result.Value,
                InventoryValid = inventoryTask.Result.IsSuccess && inventoryTask.Result.Value,
                ShiftValid = shiftTask.Result.IsSuccess && shiftTask.Result.Value,
            };

            return ResultDto<ValidationResult>.Success(result);
        }

        private async Task<ResultDto<bool>> ValidateReferenceAsync(string servicePath, string endpoint, string entityName)
        {
            try
            {
                var baseUrl = _configuration["ServicesURLs:BaseUrl"];
                var url = $"{baseUrl}/{servicePath}/{endpoint}";

                _logger.LogDebug("Validating {EntityName} at URL: {Url}", entityName, url);

                var response = await _httpClient.GetAsync(url);

                if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    _logger.LogWarning("{EntityName} not found", entityName);
                    return ResultDto<bool>.Success(false);
                }

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Error validating {EntityName}: {StatusCode}", entityName, response.StatusCode);
                    return ResultDto<bool>.Failure($"Error validating {entityName}: {response.StatusCode}");
                }

                return ResultDto<bool>.Success(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception validating {EntityName}", entityName);
                return ResultDto<bool>.Failure($"Exception validating {entityName}: {ex.Message}");
            }
        }
    }
}