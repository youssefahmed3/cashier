using Microsoft.Extensions.DependencyInjection;
using Order.Core.Interfaces.Services;
using Shared.Requests;
using System.Security.Claims;

namespace Order.API.Middleware
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
                string token = ExtractTokenFromRequest(context.Request);

                if (!string.IsNullOrEmpty(token))
                {
                    using var scope = _scopeFactory.CreateScope();
                    var tokenValidationClient = scope.ServiceProvider.GetRequiredService<ITokenValidationClient>();
                    var request = new TokenValidationRequest { Token = token };

                    try
                    {
                        var validationResponse = await tokenValidationClient.ValidateTokenAsync(request);

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
                                }
                            }

                            // IMPORTANT: Use the same scheme name as registered
                            var identity = new ClaimsIdentity(claims, AUTHENTICATION_SCHEME);
                            context.User = new ClaimsPrincipal(identity);

                            using var logScope = _scopeFactory.CreateScope();
                            var logger = logScope.ServiceProvider.GetRequiredService<ILogger<JwtAuthenticationMiddleware>>();
                            logger.LogInformation("JWT authentication successful for user: {UserId}",
                                validationResponse.UserInfo.UserId);
                        }
                    }
                    catch (Exception ex)
                    {
                        using var logScope = _scopeFactory.CreateScope();
                        var logger = logScope.ServiceProvider.GetRequiredService<ILogger<JwtAuthenticationMiddleware>>();
                        logger.LogError(ex, "Error validating JWT token");
                    }
                }

                await _next(context);
            }

            private string ExtractTokenFromRequest(HttpRequest request)
            {
                var bearerToken = request.Headers["Authorization"].FirstOrDefault();

                if (!string.IsNullOrWhiteSpace(bearerToken) && bearerToken.StartsWith("Bearer "))
                {
                    return bearerToken.Substring(7);
                }

                return null;
            }
    }
    
}
