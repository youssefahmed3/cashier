namespace Cashier.Shared.DTOS
{
    public class Confirm2FAResponseDto
    {
        public string Message { get; set; } = string.Empty;
        public bool IsSuccess { get; set; }
        public string Token { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }

    }
}
