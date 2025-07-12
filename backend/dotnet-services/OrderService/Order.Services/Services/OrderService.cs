using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Order.Core.Entities;
using Order.Core.Enums;
using Order.Core.Interfaces.Repositories;
using Order.Core.Interfaces.Services;
using Shared.DTOS;

namespace Order.Services.Services
{
    public class OrderService : IOrderService<OrderDto, Guid, ResultDto<OrderDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public OrderService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ResultDto<OrderDto>> CreateOrderAsync(OrderDto orderDto)
        {
            try
            {

                var existingOrder = await _unitOfWork.Orders.GetByIdAsync(orderDto.OrderId);
                if (existingOrder != null)
                {
                    return ResultDto<OrderDto>.Failure("An order with the provided ID already exists.");
                }
                //TODO: Validate products/ inventory call external ProductService


               var order = _mapper.Map<SalesOrder>(orderDto);

                await _unitOfWork.Orders.AddAsync(order);
                await _unitOfWork.SaveChangesAsync();

                return ResultDto<OrderDto>.Success(orderDto);
            }
            catch (Exception ex)
            {
                return ResultDto<OrderDto>.Failure($"Failed to create order: {ex.Message}");
            }

        }

        public async Task<ResultDto<OrderDto>> GetOrderByIdAsync(Guid orderId)
        {
            var order = await _unitOfWork.Orders.GetOrderWithItemsAsync(orderId);

            if (order is null)
                return ResultDto<OrderDto>.Failure("Order not found.");

            var orderDto = _mapper.Map<OrderDto>(order);
            return ResultDto<OrderDto>.Success(orderDto);
        }

        public async Task<ResultDto<OrderDto>> UpdateOrderStatusAsync(Guid orderId, string newStatus)
        {
            var existingOrder = await _unitOfWork.Orders.GetByIdAsync(orderId);
            if (existingOrder == null)
            {
                return ResultDto<OrderDto>.Failure("An order with the provided ID not exists.");
            }
            var orderStatus = _mapper.Map<OrderStatus>(newStatus);
            var updateSucceeded = await _unitOfWork.Orders.UpdateStatusOrderAsync(orderId, orderStatus);

            if (!updateSucceeded)
                return ResultDto<OrderDto>.Failure("Failed to update order status.");

            await _unitOfWork.SaveChangesAsync();
            return await GetOrderByIdAsync(orderId);
        }

    }
}
