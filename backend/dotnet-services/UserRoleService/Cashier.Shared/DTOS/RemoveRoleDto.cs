namespace Cashier.Shared.DTOS
{
    public class RemoveRoleDto
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public int TenantId { get; set; }
    }
}
