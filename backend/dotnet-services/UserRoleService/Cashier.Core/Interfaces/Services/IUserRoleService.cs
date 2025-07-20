namespace Cashier.Core.Interfaces.Services
{
    public interface IUserRoleService
    {
        Task<List<AppUserDto>> GetAllUsersAsync(UserQueryDto? filter);
        Task<List<AppRoleDto>> GetAllRolesAsync();
        Task AssignRoleAsync(AssignRoleDto dto);
        Task<bool> UpdateUserAsync(UpdateUserDto dto);
        Task<bool> UnassignRoleAsync(UnassignRoleDto dto);
        Task<List<UserRoleInfoDto>> GetUserRolesAsync(int userId, int tenantId);
        Task<List<AppUserDto>> GetUsersInRoleAsync(int roleId, int tenantId);
        Task<(bool Success, string Message)> AssignPermissionsToUserAsync(AssignPermissionDto dto);
        Task<AppUserToReturnDto> GetUserAsync(int userId);
        Task<bool> SuspendUserAsync(int userId);
        Task<bool> UnsuspendUserAsync(int userId);
        Task<List<UserWithRolesDto>> GetUsersWithRolesByTenantAsync(int tenantId);
        Task<List<PermissionDto>> GetUserPermissionsAsync(int userId);
    }
}
