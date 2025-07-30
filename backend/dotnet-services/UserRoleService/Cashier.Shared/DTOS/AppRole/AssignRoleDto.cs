namespace Cashier.Shared.DTOS.AppRole
{
    public class AssignRoleDto
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public Guid TenantId { get; set; }
    }
}
