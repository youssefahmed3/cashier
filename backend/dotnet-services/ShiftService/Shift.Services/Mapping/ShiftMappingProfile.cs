using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Shared.DTOS;
using Shift.Core.Entities;
using Shift.Core.Enums;

namespace Shift.Services.Mapping
{
    public class ShiftMappingProfile : Profile
    {
        public ShiftMappingProfile() 
        {
            CreateMap<Core.Entities.Shift, ShiftDto>()
            .ForMember(dest => dest.DrawerLogs, opt => opt.MapFrom(src => src.DrawerLogs));

            CreateMap<ShiftDto, Core.Entities.Shift>()
                .ForMember(dest => dest.Id, opt => opt.Ignore()) // ignore Id during creation
                .ForMember(dest => dest.DrawerLogs, opt => opt.MapFrom(src => src.DrawerLogs));

            CreateMap<DrawerLog, DrawerLogDto>()
                .ForMember(dest => dest.TransactionType, opt => opt.MapFrom(src => src.TransactionType.ToString()));

            CreateMap<DrawerLogDto, DrawerLog>()
                .ForMember(dest => dest.Id, opt => opt.Ignore()) 
                .ForMember(dest => dest.TransactionType, opt => opt.MapFrom(src => Enum.Parse<TransactionType>(src.TransactionType, true)));
        }

    }
}
