namespace Cashier.Services.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AppUser, AppUserDto>().ReverseMap();
            CreateMap<AppRole, AppRoleDto>().ReverseMap();
            CreateMap<AppUser, AppUserToReturnDto>();
        }
    }
}
