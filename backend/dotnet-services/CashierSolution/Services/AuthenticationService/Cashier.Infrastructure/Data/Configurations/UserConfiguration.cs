namespace Cashier.Infrastructure.Data.Configurations
{
    internal class UserConfiguration : IEntityTypeConfiguration<AppUser>
    {
        public void Configure(EntityTypeBuilder<AppUser> builder)
        {
            builder.ToTable("Users");
            builder.Property(U => U.UserName).HasMaxLength(15);
            builder.Property(U => U.Firstname).HasMaxLength(15);
            builder.Property(U => U.Lastname).HasMaxLength(15);
        }
    }
}
