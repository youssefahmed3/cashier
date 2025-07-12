using AutoMapper;
using Order.Core.Entities;
using Order.Core.Interfaces.Repositories;
using Order.Core.Interfaces.Services;
using Shared.DTOS;

public class OrderItemService : IOrderItemService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public OrderItemService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    private async Task<(bool IsValid, SalesOrder? Order, string? Error)> ValidateOrderAsync(Guid orderId, Guid branchId)
    {
        var order = await _unitOfWork.Orders.GetOrderWithItemsAsync(orderId);
        if (order == null || order.BranchId != branchId)
        {
            return (false, null, "Invalid order or insufficient permissions.");
        }
        return (true, order, null);
    }

    public async Task<ResultDto<IEnumerable<OrderItemDto>>> GetAllAsync(Guid orderId, Guid branchId)
    {
        var (isValid, order, error) = await ValidateOrderAsync(orderId, branchId);
        if (!isValid)
            return ResultDto<IEnumerable<OrderItemDto>>.Failure(error!);

        var items = order.OrderItems ?? new List<OrderItem>();
        var dtoList = _mapper.Map<IEnumerable<OrderItemDto>>(items);
        return ResultDto<IEnumerable<OrderItemDto>>.Success(dtoList);
    }

    public async Task<ResultDto<OrderItemDto>> GetByIdAsync(Guid itemId, Guid orderId, Guid branchId)
    {
        var (isValid, _, error) = await ValidateOrderAsync(orderId, branchId);
        if (!isValid)
            return ResultDto<OrderItemDto>.Failure(error!);

        var item = await _unitOfWork.OrderItems.GetByIdAsync(itemId);
        if (item == null || item.OrderId != orderId)
            return ResultDto<OrderItemDto>.Failure("Order item not found.");

        var dto = _mapper.Map<OrderItemDto>(item);
        return ResultDto<OrderItemDto>.Success(dto);
    }

    public async Task<ResultDto<OrderItemDto>> CreateAsync(OrderItemDto dto, Guid branchId)
    {
        var (isValid, _, error) = await ValidateOrderAsync(dto.OrderId, branchId);
        if (!isValid)
            return ResultDto<OrderItemDto>.Failure(error!);

        var entity = _mapper.Map<OrderItem>(dto);
        entity.Id = Guid.NewGuid();

        await _unitOfWork.OrderItems.AddAsync(entity);
        await _unitOfWork.SaveChangesAsync();

        var createdDto = _mapper.Map<OrderItemDto>(entity);
        return ResultDto<OrderItemDto>.Success(createdDto);
    }

    public async Task<ResultDto<bool>> UpdateAsync(Guid branchId, OrderItemDto dto)
    {
        var (isValid, _, error) = await ValidateOrderAsync(dto.OrderId, branchId);
        if (!isValid)
            return ResultDto<bool>.Failure(error!);

        var item = await _unitOfWork.OrderItems.GetByIdAsync(dto.Id.Value);
        if (item == null || item.OrderId != dto.OrderId)
            return ResultDto<bool>.Failure("Order item not found.");

        _mapper.Map(dto, item);
        _unitOfWork.OrderItems.Update(item);
        await _unitOfWork.SaveChangesAsync();

        return ResultDto<bool>.Success(true);
    }

    public async Task<ResultDto<bool>> DeleteAsync(Guid itemId, Guid orderId, Guid branchId)
    {
        var (isValid, _, error) = await ValidateOrderAsync(orderId, branchId);
        if (!isValid)
            return ResultDto<bool>.Failure(error!);

        var item = await _unitOfWork.OrderItems.GetByIdAsync(itemId);
        if (item == null || item.OrderId != orderId)
            return ResultDto<bool>.Failure("Order item not found.");

        _unitOfWork.OrderItems.Delete(item);
        await _unitOfWork.SaveChangesAsync();

        return ResultDto<bool>.Success(true);
    }
}
