namespace Cashier.Infrastructure.Data.Configurations
{
    internal class UserPermissionConfigurations : IEntityTypeConfiguration<UserPermissions>
    {
        public void Configure(EntityTypeBuilder<UserPermissions> builder)
        {
            builder.HasKey(up => new { up.AppUserId, up.PermissionId });

            builder.HasOne(up => up.AppUser)
                .WithMany()
                .HasForeignKey(up => up.AppUserId);

            builder.HasOne(up => up.Permission)
                .WithMany()
                .HasForeignKey(up => up.PermissionId);
        }
    }
}
