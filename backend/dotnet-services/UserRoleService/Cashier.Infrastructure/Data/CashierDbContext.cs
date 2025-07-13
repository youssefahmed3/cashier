namespace Cashier.Infrastructure.Data
{
    public class CashierDbContext : IdentityDbContext<AppUser, AppRole, int, IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>,
    IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public CashierDbContext(DbContextOptions<CashierDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            modelBuilder.Ignore<IdentityUserClaim<int>>();
            modelBuilder.Ignore<IdentityUserLogin<int>>();
            modelBuilder.Ignore<IdentityRoleClaim<int>>();
            modelBuilder.Ignore<IdentityUserToken<int>>();
        }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<UserPermissions> UserPermissions { get; set; }

    }
}
