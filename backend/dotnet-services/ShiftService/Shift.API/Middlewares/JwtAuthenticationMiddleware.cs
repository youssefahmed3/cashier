using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Shift.Core.Interfaces.Services;
using Shared.Requests;
using System.Security.Claims;

namespace Shift.API.Middleware
{
    public class JwtAuthenticationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IServiceScopeFactory _scopeFactory;
        private const string AUTHENTICATION_SCHEME = "CustomJwt"; // Must match Program.cs

        public JwtAuthenticationMiddleware(RequestDelegate next, IServiceScopeFactory scopeFactory)
        {
            _next = next;
            _scopeFactory = scopeFactory;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var token = ExtractTokenFromRequest(context.Request);

            if (!string.IsNullOrEmpty(token))
            {
                using var scope = _scopeFactory.CreateScope();
                var tokenValidationClient = scope.ServiceProvider.GetRequiredService<ITokenValidationClient>();
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<JwtAuthenticationMiddleware>>();

                try
                {
                    logger.LogDebug("Validating JWT token...");

                    var validationRequest = new TokenValidationRequest { Token = token };
                    var validationResponse = await tokenValidationClient.ValidateTokenAsync(validationRequest);

                    if (validationResponse.IsValid && validationResponse.UserInfo != null)
                    {
                        var claims = new List<Claim>
                        {
                            new Claim(ClaimTypes.NameIdentifier, validationResponse.UserInfo.UserId),
                            new Claim(ClaimTypes.Name, validationResponse.UserInfo.Username ?? string.Empty)
                        };

                        if (validationResponse.UserInfo.Roles != null)
                        {
                            foreach (var role in validationResponse.UserInfo.Roles)
                            {
                                claims.Add(new Claim(ClaimTypes.Role, role));
                                logger.LogDebug("Added role claim: {Role}", role);
                            }
                        }

                        var identity = new ClaimsIdentity(claims, AUTHENTICATION_SCHEME);
                        context.User = new ClaimsPrincipal(identity);

                        logger.LogInformation("JWT authentication successful for user: {UserId}", validationResponse.UserInfo.UserId);
                    }
                    else
                    {
                        logger.LogWarning("Token validation failed. IsValid: {IsValid}, Message: {Message}",
                            validationResponse.IsValid, validationResponse.Message);
                    }
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error occurred during JWT token validation.");
                }
            }
            else
            {
                using var scope = _scopeFactory.CreateScope();
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<JwtAuthenticationMiddleware>>();
                logger.LogDebug("No bearer token found in the Authorization header.");
            }

            await _next(context);
        }

        private string? ExtractTokenFromRequest(HttpRequest request)
        {
            var bearerToken = request.Headers["Authorization"].FirstOrDefault();
            return !string.IsNullOrWhiteSpace(bearerToken) && bearerToken.StartsWith("Bearer ")
                ? bearerToken.Substring(7)
                : null;
        }
    }

}
