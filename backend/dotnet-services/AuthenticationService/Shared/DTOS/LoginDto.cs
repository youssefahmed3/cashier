using System.ComponentModel.DataAnnotations;

namespace Cashier.Shared.DTOS
{
    public class LoginDto
    {
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
