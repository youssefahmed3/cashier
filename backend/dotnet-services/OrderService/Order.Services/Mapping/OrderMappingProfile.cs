using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;
using AutoMapper;
using Order.Core.Entities;
using Order.Core.Enums;
using Shared.DTOS;

namespace Order.Services.Mapping
{
    public class OrderMappingProfile : Profile
    {
        public OrderMappingProfile() 
        {

            CreateMap<SalesOrder, OrderDto>()
            .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.OrderItems));

            CreateMap<OrderDto, SalesOrder>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.Items));


            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Qty))
                .ForMember(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.UnitPrice))
                .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.OrderId))
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductId))
                .ReverseMap()
                .ForMember(dest => dest.Id, opt => opt.Ignore());




            CreateMap<OrderStatus, string>()
                .ConvertUsing(src => src.ToString());

            CreateMap<string, OrderStatus>()
                .ConvertUsing(value => ConvertToOrderStatus(value));
        }

        private OrderStatus ConvertToOrderStatus(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return OrderStatus.New;
            return Enum.TryParse<OrderStatus>(value, true, out var status) ? status : OrderStatus.New;
        }
    }
}
