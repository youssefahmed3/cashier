namespace Cashier.Shared.DTOS.Identity
{
    public class Confirm2FADto
    {
        public string Email { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
    }
}
