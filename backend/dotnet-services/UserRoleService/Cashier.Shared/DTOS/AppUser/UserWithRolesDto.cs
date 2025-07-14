namespace Cashier.Shared.DTOS.AppUser
{
    public class UserWithRolesDto
    {
        public int UserId { get; set; }
        public string? Email { get; set; }
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }
        public IEnumerable<string> Roles { get; set; } = new List<string>();
    }
}
