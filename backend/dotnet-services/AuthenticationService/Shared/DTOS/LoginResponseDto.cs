namespace Cashier.Shared.DTOS
{
    public class LoginResponseDto
    {
        public bool IsSuccess { get; set; } = false;
        public string Token { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
        public bool Requires2FA { get; set; }
        public IEnumerable<string> Errors { get; set; } = new List<string>();
        public string Message { get; set; } = string.Empty;
    }
}
