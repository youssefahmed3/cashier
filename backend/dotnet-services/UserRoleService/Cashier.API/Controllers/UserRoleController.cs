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
        //POST: api/userrole/remove-role
        [HttpPost("remove-role")]
        public async Task<IActionResult> RemoveRole([FromBody] RemoveRoleDto dto)
        {
            var result = await _service.RemoveRoleAsync(dto);
            return result ? Ok("Role removed.") : NotFound("Role assignment not found.");
        }
        //POST: api/userrole/update-user
        [HttpPost("update-user")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDto dto)
        {
            var updated = await _service.UpdateUserAsync(dto);
            return updated ? Ok("User updated.") : NotFound("User not found.");
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
            await _service.AssignPermissionsToUserAsync(dto);
            return Ok("Permissions assigned.");
        }
        // DELETE: api/userrole/users/{userId}
        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> RemoveUser(int userId)
        {
            var success = await _service.RemoveUserAsync(userId);
            return success ? Ok("User removed.") : NotFound("User not found.");
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
