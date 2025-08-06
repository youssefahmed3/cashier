using Shared.DTOS;
using Shared.Requests;

namespace Order.Core.Interfaces.Services
{
    public interface IValidationService
    {
        Task<ResultDto<bool>> ValidateBranchAsync(long branchId);
        Task<ResultDto<bool>> ValidateCustomerAsync(long customerId);
        Task<ResultDto<ValidationResult>> ValidateOrderAsync(OrderDto orderDto);
        Task<ResultDto<bool>> ValidateShiftAsync(long shiftId, long userId);
    }
}