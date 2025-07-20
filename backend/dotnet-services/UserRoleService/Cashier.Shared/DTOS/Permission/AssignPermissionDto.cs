namespace Cashier.Shared.DTOS.Permission
{
    public class AssignPermissionDto
    {
        public int AppUserId { get; set; }
        public IEnumerable<int> PermissionIds { get; set; } = new List<int>();
    }
}
