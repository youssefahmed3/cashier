namespace Cashier.Shared.DTOS
{
    public class AssignRoleDto
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public int TenantId { get; set; }
    }
}
