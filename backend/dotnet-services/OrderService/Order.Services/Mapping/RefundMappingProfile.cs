using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Order.Core.Entities;
using Shared.DTOS;

namespace Order.Services.Mapping
{
    public class RefundMappingProfile : Profile
    {
        public RefundMappingProfile() {
            CreateMap<Refund, RefundDto>()
          .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.RefundItems));

            CreateMap<RefundDto, Refund>()
                .ForMember(dest => dest.RefundItems, opt => opt.MapFrom(src => src.Items));

            CreateMap<RefundItem, RefundItemDto>();
            CreateMap<RefundItemDto, RefundItem>();
        }

    }
}
