namespace Cashier.Core.Entities
{
    public class UserRole : IdentityUserRole<int>
    {
        public int TenantId { get; set; }
    }
}
