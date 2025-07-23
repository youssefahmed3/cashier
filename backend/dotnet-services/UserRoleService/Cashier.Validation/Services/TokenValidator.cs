namespace Cashier.Validation.Services
{
    public class TokenValidator(TokenValidationParameters _tokenValidationParameters,UserManager<AppUser> _userManager) : ITokenValidator
    {
        public async Task<(bool IsValid, string? Message, ClaimsPrincipal? Principal, Dictionary<string, string>? Claims)> ValidateTokenAsync(string token)
        {
            try
            {
                var principal = GetPrincipalFromToken(token, out var jwtToken);
                if (jwtToken == null)
                    return (false, "Invalid token signature", null, null);

                var userId = ExtractUserId(principal);
                if (string.IsNullOrEmpty(userId))
                    return (false, "User ID claim is missing", null, null);

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null || user.IsSuspended)
                    return (false, "User is invalid or suspended", null, null);

                var claims = ExtractRelevantClaims(principal);

                return (true, null, principal, claims);
            }
            catch (SecurityTokenExpiredException)
            {
                return (false, "Token has expired", null, null);
            }
            catch (Exception)
            {
                return (false, "Token validation failed", null, null);
            }
        }

        private ClaimsPrincipal GetPrincipalFromToken(string token, out JwtSecurityToken? jwtToken)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, _tokenValidationParameters, out var validatedToken);

            jwtToken = validatedToken as JwtSecurityToken;
            if (jwtToken == null || !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                return null!;

            return principal;
        }

        private string? ExtractUserId(ClaimsPrincipal principal)
        {
            return principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        private Dictionary<string, string> ExtractRelevantClaims(ClaimsPrincipal principal)
        {
            return principal.Claims
                .Where(c => c.Type != "jti" && c.Type != "iss" && c.Type != "aud")
                .GroupBy(c => c.Type)
                .ToDictionary(
                    g => g.Key == ClaimTypes.NameIdentifier ? "userId" :
                         g.Key == ClaimTypes.Email ? "email" :
                         g.Key == ClaimTypes.Role ? "roles" :
                         g.Key == JwtRegisteredClaimNames.Exp ? "expiration" :
                         g.Key,
                    g =>
                        g.Key == JwtRegisteredClaimNames.Exp
                            ? ConvertExpirationToDateTime(g.First().Value)
                            : string.Join(",", g.Select(c => c.Value))
                );
        }

        private string ConvertExpirationToDateTime(string expValue)
        {
            if (long.TryParse(expValue, out var expUnix))
                return DateTimeOffset.FromUnixTimeSeconds(expUnix).ToString("yyyy-MM-dd HH:mm:ss");
            return expValue;
        }
    }
}

