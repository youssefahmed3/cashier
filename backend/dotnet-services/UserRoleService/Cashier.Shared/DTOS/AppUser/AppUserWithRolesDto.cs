namespace Cashier.Shared.DTOS.AppUser
{
    public class AppUserWithRolesDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Firstname { get; set; } = string.Empty;
        public string Lastname { get; set; } = string.Empty;
        public bool IsSuspended { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public IEnumerable<string> Roles { get; set; } = new List<string>();

    }
}
