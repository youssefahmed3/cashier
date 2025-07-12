
using Shared.DTOS;

namespace Order.Core.Interfaces.Services
{
    public interface IOrderItemService
    {
        Task<ResultDto<OrderItemDto>> CreateAsync(OrderItemDto dto, Guid branchId);
        Task<ResultDto<bool>> DeleteAsync(Guid itemId, Guid orderId, Guid branchId);
        Task<ResultDto<IEnumerable<OrderItemDto>>> GetAllAsync(Guid orderId, Guid branchId);
        Task<ResultDto<OrderItemDto>> GetByIdAsync(Guid itemId, Guid orderId, Guid branchId);
        Task<ResultDto<bool>> UpdateAsync(Guid branchId, OrderItemDto dto);
    }
}