namespace Cashier.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserRoleController(IUserRoleService _service) : ControllerBase
    {
        //GET: api/userrole/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers(UserQueryDto? filter)
        {
            var users = await _service.GetAllUsersAsync(filter);
            return Ok(users);
        }
        //GET : api/userrole/users/{userId}
        [HttpGet("users/{userId}")]
        public async Task<IActionResult> GetUserById(int userId)
        {
            var user = await _service.GetUserAsync(userId);
            return Ok(user);
        }
        //GET: api/userrole/roles
        [HttpGet("roles")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _service.GetAllRolesAsync();
            return Ok(roles);
        }
        //POST: api/userrole/assign-role
        [HttpPost("assign-role")]
        public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto dto)
        {
            await _service.AssignRoleAsync(dto);
            return Ok("Role assigned successfully.");
        }
        //POST: api/userrole/unassign-role
        [HttpPost("unassign-role")]
        public async Task<IActionResult> UnassignRole([FromBody] UnassignRoleDto dto)
        {
            var result = await _service.UnassignRoleAsync(dto);
            return result ? Ok("Role unassigned from the user.") : NotFound("Role assignment not found.");
        }
        //POST: api/userrole/update-user
        [HttpPost("update-user")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDto dto)
        {
            var updated = await _service.UpdateUserAsync(dto);
            return Ok(new
            {
                success = updated,
                message = updated ? "User updated." : "User not found."
            });
        }
        // GET: api/userrole/user/{userId}/tenant/{tenantId}/roles
        [HttpGet("user/{userId}/tenant/{tenantId}/roles")]
        public async Task<IActionResult> GetUserRoles(int userId, int tenantId)
        {
            var roles = await _service.GetUserRolesAsync(userId, tenantId);
            return Ok(roles);
        }
        // GET: api/userrole/role/{roleId}/tenant/{tenantId}/users
        [HttpGet("role/{roleId}/tenant/{tenantId}/users")]
        public async Task<IActionResult> GetUsersInRole(int roleId, int tenantId)
        {
            var users = await _service.GetUsersInRoleAsync(roleId, tenantId);
            return Ok(users);
        }
        // POST: api/userrole/assign-permissions
        [HttpPost("assign-permissions")]
        public async Task<IActionResult> AssignPermissions([FromBody] AssignPermissionDto dto)
        {
           var result = await _service.AssignPermissionsToUserAsync(dto);
            return Ok(new
            {
                isSuccess = result.Success,
                message = result.Message
            });
        }
        // POST: api/userrole/users/suspend/{userId}
        [HttpPost("users/suspend/{userId}")]
        public async Task<IActionResult> SuspendUser(int userId)
        {
            var success = await _service.SuspendUserAsync(userId);
            return Ok(new
            {
                success,
                message = success ? "User suspended." : "User not found."
            });
        }
        // PUT: api/userrole/users/unsuspend/{userId}
        [HttpPut("users/unsuspend/{userId}")]
        public async Task<IActionResult> UnsuspendUser(int userId)
        {
            var result = await _service.UnsuspendUserAsync(userId);
            return Ok(new
            {
                success = result,
                message = result ? "User unsuspended successfully." : "User not found."
            });
        }
        // GET: api/userrole/tenant/{tenantId}/users-with-roles
        [HttpGet("tenant/{tenantId}/users-with-roles")]
        public async Task<IActionResult> GetUsersWithRolesByTenant(int tenantId)
        {
            var usersWithRoles = await _service.GetUsersWithRolesByTenantAsync(tenantId);
            return Ok(usersWithRoles);
        }
        // GET: api/userrole/user/{userId}/permissions
        [HttpGet("user/{userId}/permissions")]
        public async Task<IActionResult> GetUserPermissions(int userId)
        {
            var permissions = await _service.GetUserPermissionsAsync(userId);
            return Ok(permissions);
        }
    }
}
