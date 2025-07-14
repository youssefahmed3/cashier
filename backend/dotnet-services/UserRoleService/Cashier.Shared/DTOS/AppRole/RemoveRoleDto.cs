namespace Cashier.Shared.DTOS.AppRole
{
    public class UnassignRoleDto
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public int TenantId { get; set; }
    }
}
