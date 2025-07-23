namespace Cashier.Infrastructure.Data
{
    public class CashierContextSeed
    {
        public static async Task SeedDataAsync(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, CashierDbContext context)
        {
            var basePath = @"..\Cashier.Infrastructure\Data\";
            var dataSeedingPath = Path.Combine(basePath!, "DataSeeding");
            var permissionsPath = Path.Combine(dataSeedingPath, "Permissions.json");
            var userPermissionsPath = Path.Combine(dataSeedingPath, "UserPermissions.json");
            var rolesPath = Path.Combine(dataSeedingPath, "Roles.json");
            var usersPath = Path.Combine(dataSeedingPath, "Users.json");
            var userRolesPath = Path.Combine(dataSeedingPath, "UserRoles.json");

            var permissions = JsonConvert.DeserializeObject<List<Permission>>(File.ReadAllText(permissionsPath));
            var userPermissions = JsonConvert.DeserializeObject<List<UserPermissions>>(File.ReadAllText(userPermissionsPath));
            var roles = JsonConvert.DeserializeObject<List<AppRole>>(File.ReadAllText(rolesPath));
            var users = JsonConvert.DeserializeObject<List<AppUser>>(File.ReadAllText(usersPath));
            var userRoles = JsonConvert.DeserializeObject<List<UserRole>>(File.ReadAllText(userRolesPath));

            foreach (var role in roles!)
            {
                if (!await roleManager.RoleExistsAsync(role.Name!))
                {
                    await roleManager.CreateAsync(role);
                }
            }

            foreach (var user in users!)
            {
                var existing = await userManager.FindByEmailAsync(user.Email!);
                if (existing == null)
                {
                    await userManager.CreateAsync(user, "Password@123");
                }
            }

            foreach (var ur in userRoles!)
            {
                var exists = await context.UserRoles.AnyAsync(x => x.UserId == ur.UserId && x.RoleId == ur.RoleId);
                if (!exists)
                {
                    context.UserRoles.Add(ur);
                }
            }
            foreach (var permission in permissions!)
            {
                var exists = await context.Permissions.AnyAsync(p => p.Name == permission.Name);
                if (!exists)
                {
                    context.Permissions.Add(permission);
                }
            }
            foreach (var userPermission in userPermissions!)
            {
                var exists = await context.UserPermissions.AnyAsync(p => (p.PermissionId == userPermission.PermissionId) && (p.AppUserId == userPermission.AppUserId));
                if (!exists)
                {
                    context.UserPermissions.Add(userPermission);
                }
            }
            await context.SaveChangesAsync();
        }
    }
}
