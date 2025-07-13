namespace Cashier.Shared.DTOS
{
    public class UserWithRolesDto
    {
        public int UserId { get; set; }
        public string? Email { get; set; }
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }
        public List<string> Roles { get; set; } = new();
    }
}
