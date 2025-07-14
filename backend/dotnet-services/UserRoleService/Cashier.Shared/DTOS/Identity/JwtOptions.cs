namespace Cashier.Shared.DTOS.Identity
{
    public class JwtOptions
    {
        public string SecretKey { get; set; } = string.Empty;
        public double ExpirationInDays { get; set; }
        public string Issuer { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
    }
}
