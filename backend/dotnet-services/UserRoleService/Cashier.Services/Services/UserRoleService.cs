using Microsoft.EntityFrameworkCore;

namespace Cashier.Services.Services
{
    public class UserRoleService(IUnitOfWork _unitOfWork, IMapper _mapper,
        IHttpContextAccessor _httpContextAccessor, UserManager<AppUser> _userManager) : IUserRoleService
    {
        // Retrieves a paginated and filtered list of users.
        public async Task<List<AppUserDto>> GetAllUsersAsync(UserQueryDto? filter)
        {
            filter ??= new UserQueryDto();

            var query = await _unitOfWork.GetRepository<AppUser, int>().GetAllAsync();

            if (!string.IsNullOrWhiteSpace(filter.Email))
                query = query.Where(u => u.Email != null && u.Email.Contains(filter.Email));

            if (!string.IsNullOrWhiteSpace(filter.FirstName))
                query = query.Where(u => (u.Firstname != null && u.Firstname.Contains(filter.FirstName))
                                      || (u.Lastname != null && u.Lastname.Contains(filter.FirstName)));

            var users = query
                .Where(u => !u.IsSuspended)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            return users.Select(_mapper.Map<AppUserDto>).ToList();
        }
        //Retrive data of current logged in user 
        public async Task<AppUserWithRolesDto> GetCurrentUserAsync()
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return new AppUserWithRolesDto();

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);
            if (user == null)
                return new AppUserWithRolesDto();

            var userDto = _mapper.Map<AppUserWithRolesDto>(user);
            userDto.Roles = (await _userManager.GetRolesAsync(user)).ToList();

            return userDto;
        }

        // Retrieves all roles in the system.
        public async Task<List<AppRoleDto>> GetAllRolesAsync()
        {
            var roles = await _unitOfWork.GetRepository<AppRole, int>().GetAllAsync();
            return roles.Select(r => _mapper.Map<AppRoleDto>(r)).ToList();
        }
        // Assigns a role to a user in a specific tenant.
        public async Task AssignRoleAsync(AssignRoleDto dto)
        {
            var userRole = new UserRole
            {
                UserId = dto.UserId,
                RoleId = dto.RoleId,
                TenantId = dto.TenantId
            };

            await _unitOfWork.GetRepository<UserRole, int>().AddAsync(userRole);
            await _unitOfWork.SaveChangesAsync();
        }
        // Updates user information
        public async Task<bool> UpdateUserAsync(UpdateUserDto dto)
        {
            var userRepo = _unitOfWork.GetRepository<AppUser, int>();
            var user = await userRepo.GetByIdAsync(dto.Id);
            if (user == null)
                return false;

            user.Email = dto.Email;
            user.Firstname = dto.Firstname;
            user.Lastname = dto.Lastname;

            userRepo.Update(user);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
        // Get user by Id
        public async Task<AppUserToReturnDto> GetUserAsync(int userId)
        {
            var user = await _unitOfWork.GetRepository<AppUser, int>().GetByIdAsync(userId);
            if (user == null)
                return new AppUserToReturnDto();
            return _mapper.Map<AppUserToReturnDto>(user);
        }
        // Remove role from user
        public async Task<bool> UnassignRoleAsync(UnassignRoleDto dto)
        {
            var userRoleRepo = _unitOfWork.GetRepository<UserRole, int>();
            var allRoles = await userRoleRepo.GetAllAsync();
            var userRole = allRoles.FirstOrDefault(x => x.UserId == dto.UserId &&
                                                         x.RoleId == dto.RoleId &&
                                                         x.TenantId == dto.TenantId);
            if (userRole == null)
                return false;

            userRoleRepo.Delete(userRole);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
        // Gets the roles assigned to a user for a specific tenant.
        public async Task<List<UserRoleInfoDto>> GetUserRolesAsync(int userId, int tenantId)
        {
            var userRoleRepo = _unitOfWork.GetRepository<UserRole, int>();
            var roleRepo = _unitOfWork.GetRepository<AppRole, int>();

            var userRoles = await userRoleRepo.GetAllAsync();
            var roles = await roleRepo.GetAllAsync();

            var assignedRoles = from ur in userRoles
                                join r in roles on ur.RoleId equals r.Id
                                where ur.UserId == userId && ur.TenantId == tenantId
                                select new UserRoleInfoDto
                                {
                                    RoleId = r.Id,
                                    RoleName = r?.Name ?? ""
                                };

            return assignedRoles.ToList();
        }
        // Gets all users assigned to a role in a specific tenant.
        public async Task<List<AppUserDto>> GetUsersInRoleAsync(int roleId, int tenantId)
        {
            var userRoleRepo = _unitOfWork.GetRepository<UserRole, int>();
            var userRepo = _unitOfWork.GetRepository<AppUser, int>();

            var userRoles = await userRoleRepo.GetAllAsync();
            var users = await userRepo.GetAllAsync();

            var filteredUsers = from ur in userRoles
                                join u in users on ur.UserId equals u.Id
                                where ur.RoleId == roleId && ur.TenantId == tenantId
                                select _mapper.Map<AppUserDto>(u);

            return filteredUsers.ToList();
        }
        // Assigns permissions to a user, only if they do not already exist.
        public async Task<(bool Success, string Message)> AssignPermissionsToUserAsync(AssignPermissionDto dto)
        {
            var (isAuthorized, authMessage) = await EnsureCurrentUserIsAuthorizedAsync();
            if (!isAuthorized)
                return (false, authMessage);

            var validPermissionIds = await GetValidPermissionIdsAsync();
            var invalidIds = ValidatePermissions(dto.PermissionIds, validPermissionIds);
            if (invalidIds.Any())
                return (false, $"These permission IDs are invalid: {string.Join(", ", invalidIds)}");

            var existingPermissionIds = await GetExistingUserPermissionIdsAsync(dto.AppUserId);
            var newPermissions = BuildNewPermissions(dto.AppUserId, dto.PermissionIds, existingPermissionIds);

            if (newPermissions.Count == 0)
                return (true, "All permissions already assigned to the user.");

            await AddPermissionsAsync(newPermissions);
            return (true, "Permissions assigned successfully.");
        }
        // Removes a user from the system. [Hard-delete]
        //public async Task<bool> RemoveUserAsync(int userId)
        //{
        //    var userRepo = _unitOfWork.GetRepository<AppUser, int>();
        //    var user = await userRepo.GetByIdAsync(userId);
        //    if (user is null)
        //        return false;
        //    userRepo.Delete(user);
        //    await _unitOfWork.SaveChangesAsync();
        //    return true;
        //}
        // Suspend a user. [Soft-delete]
        public async Task<bool> SuspendUserAsync(int userId)
        {
            var userRepo = _unitOfWork.GetRepository<AppUser, int>();
            var user = await userRepo.GetByIdAsync(userId);
            if (user is null)
                return false;

            user.IsSuspended = true; 
            userRepo.Update(user);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
        //To unsuspend user 
        public async Task<bool> UnsuspendUserAsync(int userId)
        {
            var userRepo = _unitOfWork.GetRepository<AppUser, int>();
            var user = await userRepo.GetByIdAsync(userId);
            if (user is null)
                return false;

            user.IsSuspended = false;
            userRepo.Update(user);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        // Gets all users in a tenant with their assigned roles.
        public async Task<List<UserWithRolesDto>> GetUsersWithRolesByTenantAsync(int tenantId)
        {
            var userRepo = _unitOfWork.GetRepository<AppUser, int>();
            var userRoleRepo = _unitOfWork.GetRepository<UserRole, int>();
            var roleRepo = _unitOfWork.GetRepository<AppRole, int>();

            var users = await userRepo.GetAllAsync();
            var userRoles = await userRoleRepo.GetAllAsync();
            var roles = await roleRepo.GetAllAsync();

            var result = from u in users
                         join ur in userRoles on u.Id equals ur.UserId
                         where ur.TenantId == tenantId
                         group ur by new { u.Id, u.Email, u.Firstname, u.Lastname } into g
                         select new UserWithRolesDto
                         {
                             UserId = g.Key.Id,
                             Email = g.Key.Email,
                             Firstname = g.Key.Firstname,
                             Lastname = g.Key.Lastname,
                             Roles = g.Join(roles,
                                            ur => ur.RoleId,
                                            r => r.Id,
                                            (ur, r) => r.Name).ToList()!
                         };

            return result.ToList();
        }
        // Gets all permissions assigned to a specific user.
        public async Task<List<PermissionDto>> GetUserPermissionsAsync(int userId)
        {
            var userPermissions = await _unitOfWork.GetRepository<UserPermissions, int>().GetAllAsync();
            var allPermissions = await _unitOfWork.GetRepository<Permission, int>().GetAllAsync();
            var permissions = from up in userPermissions
                              join p in allPermissions on up.PermissionId equals p.Id
                              where up.AppUserId == userId
                              select _mapper.Map<PermissionDto>(p);

            return permissions.ToList();
        }
        // ---------- Private Helper Methods ----------
        // Checks if the current user is authorized (SuperAdmin or Admin) to assign permissions.
        private async Task<(bool IsAuthorized, string Message)> EnsureCurrentUserIsAuthorizedAsync()
        {
            var currentUserId = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(currentUserId))
                return (false, "User is not authenticated");

            var currentUser = await _userManager.FindByIdAsync(currentUserId);
            if (currentUser == null)
                return (false, "Current user not found");

            var roles = await _userManager.GetRolesAsync(currentUser);
            if (!roles.Contains("SuperAdmin") && !roles.Contains("Admin"))
                return (false, "Only Admin or SuperAdmin can assign permissions");

            return (true, "");
        }
        // Gets all valid permission IDs in the system.
        private async Task<HashSet<int>> GetValidPermissionIdsAsync()
        {
            var permissionRepo = _unitOfWork.GetRepository<Permission, int>();
            var allPermissions = await permissionRepo.GetAllAsync();
            return allPermissions.Select(p => p.Id).ToHashSet();
        }
        // Validates whether the given permission IDs exist in the system.
        private List<int> ValidatePermissions(IEnumerable<int> requestedIds, HashSet<int> validIds)
        {
            return requestedIds.Except(validIds).ToList();
        }
        // Retrieves existing permission IDs assigned to a user.
        private async Task<HashSet<int>> GetExistingUserPermissionIdsAsync(int userId)
        {
            var userPermissionRepo = _unitOfWork.GetRepository<UserPermissions, int>();
            var currentPermissions = await userPermissionRepo.GetAllAsync(up => up.AppUserId == userId);
            return currentPermissions.Select(p => p.PermissionId).ToHashSet();
        }
        // Builds a list of new user permission entities that are not already assigned.
        private List<UserPermissions> BuildNewPermissions(int userId, IEnumerable<int> requestedIds, HashSet<int> existingIds)
        {
            return requestedIds
                .Where(id => !existingIds.Contains(id))
                .Select(id => new UserPermissions
                {
                    AppUserId = userId,
                    PermissionId = id
                }).ToList();
        }
        // Adds a list of new permissions to the user and saves changes to the database.
        private async Task AddPermissionsAsync(List<UserPermissions> permissions)
        {
            var userPermissionRepo = _unitOfWork.GetRepository<UserPermissions, int>();
            await userPermissionRepo.AddRangeAsync(permissions);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
