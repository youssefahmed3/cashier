namespace Cashier.Core.Entities
{
    public class UserPermissions
    {
        public int AppUserId { get; set; } 
        public AppUser AppUser { get; set; }

        public int PermissionId { get; set; }
        public Permission Permission { get; set; }
    }
}
