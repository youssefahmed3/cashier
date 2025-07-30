using Shared.DTOS;
using Shared.Requests;

namespace Order.Core.Interfaces.Services
{
    public interface IValidationService
    {
        Task<ResultDto<bool>> ValidateBranchAsync(long branchId);
        Task<ResultDto<bool>> ValidateCustomerAsync(long customerId);
        Task<ResultDto<bool>> ValidateInventoryAsync(List<OrderItemDto> items);
        Task<ResultDto<ValidationResult>> ValidateOrderAsync(OrderDto orderDto);
        Task<ResultDto<bool>> ValidateShiftAsync(long shiftId, long userId);
        Task<ResultDto<bool>> ValidateShiftAsync(long shiftId, long userId, long branchId);
    }
}