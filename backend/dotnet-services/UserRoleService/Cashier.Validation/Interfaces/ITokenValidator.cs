using System.Security.Claims;

namespace Cashier.Validation.Interfaces
{
    public interface ITokenValidator
    {
        Task<(bool IsValid, string? Message, ClaimsPrincipal? Principal, Dictionary<string, string>? Claims)> ValidateTokenAsync(string token);
    }
}
