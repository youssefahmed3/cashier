namespace Cashier.Infrastructure.Data
{
    public class CashierContextSeed
    {
        public static async Task SeedDataAsync(CashierDbContext context)
        {
            var basePath = @"..\Cashier.Infrastructure\Data\";
            var dataSeedingPath = Path.Combine(basePath!, "DataSeeding");
            var permissionsPath = Path.Combine(dataSeedingPath, "Permissions.json");
            var userPermissionsPath = Path.Combine(dataSeedingPath, "UserPermissions.json");

            var permissions = JsonConvert.DeserializeObject<List<Permission>>(File.ReadAllText(permissionsPath));
            var userPermissions= JsonConvert.DeserializeObject<List<UserPermissions>>(File.ReadAllText(userPermissionsPath));

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
