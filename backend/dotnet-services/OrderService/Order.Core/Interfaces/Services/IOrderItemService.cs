
using Shared.DTOS;

namespace Order.Core.Interfaces.Services
{
    public interface IOrderItemService
    {
        Task<ResultDto<OrderItemDto>> CreateAsync(OrderItemDto dto, long branchId);
        Task<ResultDto<bool>> DeleteAsync(long itemId, long orderId, long branchId);
        Task<ResultDto<IEnumerable<OrderItemDto>>> GetAllAsync(long orderId, long branchId);
        Task<ResultDto<OrderItemDto>> GetByIdAsync(long itemId, long orderId, long branchId);
        Task<ResultDto<bool>> UpdateAsync(long branchId, long itemId, OrderItemDto dto);
    }
}