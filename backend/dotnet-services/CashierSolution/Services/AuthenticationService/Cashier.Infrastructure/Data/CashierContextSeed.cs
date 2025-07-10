namespace Cashier.Infrastructure.Data
{
    public static class CashierContextSeed
    {
        public static async Task SeedDataAsync(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, CashierDbContext context)
        {
            var basePath = @"..\Cashier.Infrastructure\Data\";
            var dataSeedingPath = Path.Combine(basePath!, "DataSeeding");

            var rolesPath = Path.Combine(dataSeedingPath, "Roles.json");
            var usersPath = Path.Combine(dataSeedingPath, "Users.json");
            var userRolesPath = Path.Combine(dataSeedingPath, "UserRoles.json");

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

            await context.SaveChangesAsync();
        }

    }
}
