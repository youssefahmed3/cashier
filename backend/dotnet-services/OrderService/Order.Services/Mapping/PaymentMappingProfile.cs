using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Order.Core.Entities;
using Order.Core.Enums;
using Order.Services.Helpers;
using Shared.DTOS;

namespace Order.Services.Mapping
{
    public class PaymentMappingProfile : Profile
    {
        public PaymentMappingProfile()
        {


            CreateMap<Payment, PaymentDto>()
                .ForMember(dest => dest.Method, opt => opt.MapFrom(src => src.Method.ToString()))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

            CreateMap<PaymentDto, Payment>()
            .ForMember(dest => dest.Method, opt => opt.MapFrom(src =>
                EnumHelper.ConvertToEnum<PaymentStatus>(src.Status, PaymentStatus.Pending)))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src =>
                EnumHelper.ConvertToEnum<PaymentMethod>(src.Method, PaymentMethod.Cash)))
            .ForMember(dest => dest.Order, opt => opt.Ignore()); // Ignore navigation


        }
    }
}
