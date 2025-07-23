using System.ComponentModel.DataAnnotations;

namespace Cashier.Shared.DTOS
{
    public class RegisterDto
    {
        [MaxLength(15)]
        public string Firstname { get; set; } = string.Empty;
        [MaxLength(15)]
        public string Lastname { get; set; } = string.Empty;
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
    } 
}
