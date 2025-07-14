namespace Cashier.Shared.DTOS.AppUser
{
    public class AppUserDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Firstname { get; set; } = string.Empty;
        public string Lastname { get; set; } = string.Empty;
        public bool IsSuspended { get; set; }  
    }
}
