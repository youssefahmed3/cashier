namespace Cashier.Core.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public string Firstname { get; set; } = string.Empty;
        public string Lastname { get; set; } = string.Empty;
        public bool IsFirstLogin { get; set; } = true; // Track first login
    }
}
