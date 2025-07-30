namespace Cashier.Core.Entities
{
    public class UserRole : IdentityUserRole<int>
    {
        public Guid TenantId { get; set; }
    }
}
