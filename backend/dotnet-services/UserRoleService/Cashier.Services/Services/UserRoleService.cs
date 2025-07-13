namespace Cashier.Services.Services
{
    public class UserRoleService(IUnitOfWork _unitOfWork, IMapper _mapper,
        IHttpContextAccessor _httpContextAccessor, UserManager<AppUser> _userManager) : IUserRoleService
    {
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
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            return users.Select(_mapper.Map<AppUserDto>).ToList();
        }

        public async Task<List<AppRoleDto>> GetAllRolesAsync()
        {
            var roles = await _unitOfWork.GetRepository<AppRole, int>().GetAllAsync();
            return roles.Select(r => _mapper.Map<AppRoleDto>(r)).ToList();
        }

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
        public async Task<AppUserToReturnDto> GetUserAsync(int userId)
        {
            var user = await _unitOfWork.GetRepository<AppUser, int>().GetByIdAsync(userId);
            if (user == null)
                return new AppUserToReturnDto();
            return _mapper.Map<AppUserToReturnDto>(user);
        }
        public async Task<bool> RemoveRoleAsync(RemoveRoleDto dto)
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
                                    RoleName = r.Name
                                };

            return assignedRoles.ToList();
        }
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
        public async Task AssignPermissionsToUserAsync(AssignPermissionDto dto)
        {
            var currentUserId = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId is null)
                throw new UnauthorizedAccessException("User is not authenticated");

            var currentUser = await _userManager.FindByIdAsync(currentUserId);
            if (currentUser is null)
                throw new Exception("Current user not found");

            var roles = await _userManager.GetRolesAsync(currentUser);
            if (!roles.Contains("SuperAdmin") && !roles.Contains("Admin"))
                throw new UnauthorizedAccessException("Only Admin or SuperAdmin can assign permissions");

            var userPermissionRepo = _unitOfWork.GetRepository<UserPermissions, int>();
            var existingPermissions = await userPermissionRepo
                .GetAllAsync(up => up.AppUserId == dto.AppUserId);

            // 5. Remove existing permissions
            userPermissionRepo.DeleteRange(existingPermissions);

            var newPermissions = dto.PermissionIds.Select(pid => new UserPermissions
            {
                AppUserId = dto.AppUserId,
                PermissionId = pid
            }).ToList();

            await userPermissionRepo.AddRangeAsync(newPermissions);
            await _unitOfWork.SaveChangesAsync();
        }
        public async Task<bool> RemoveUserAsync(int userId)
        {
            var userRepo = _unitOfWork.GetRepository<AppUser, int>();
            var user = await userRepo.GetByIdAsync(userId);
            if (user is null)
                return false;
            userRepo.Delete(user);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

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
    }
}
