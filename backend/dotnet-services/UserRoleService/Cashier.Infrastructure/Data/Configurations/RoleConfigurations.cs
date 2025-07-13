namespace Cashier.Infrastructure.Data.Configurations
{
    internal class RoleConfigurations : IEntityTypeConfiguration<AppRole>
    {
        public void Configure(EntityTypeBuilder<AppRole> builder)
        {
            builder.ToTable("Roles");
            builder.Property(R => R.Name).HasMaxLength(20);
        }
    }
}
