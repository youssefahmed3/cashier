namespace Cashier.Shared.DTOS.AppUser
{
    public class AppUserDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Firstname { get; set; } = string.Empty;
        public string Lastname { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public IList<string> Roles { get; set; } = new List<string>();
        public bool IsSuspended { get; set; }  
    }
}
