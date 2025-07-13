namespace Cashier.Shared.DTOS
{
    public class AssignPermissionDto
    {
        public int AppUserId { get; set; }
        public ICollection<int> PermissionIds { get; set; } = new List<int>();
    }
}
