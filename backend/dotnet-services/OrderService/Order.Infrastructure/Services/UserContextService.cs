using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Order.Core.Interfaces.Services;

namespace Order.Services.Services
{
    public class UserContextService : IUserContextService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserContextService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public long GetUserId()
        {
            var user = _httpContextAccessor.HttpContext?.User;

            var claim = user?.FindFirst(ClaimTypes.NameIdentifier);
            return claim == null ? throw new UnauthorizedAccessException("UserId claim not found.") : long.Parse(claim.Value);
        }
        public string? GetCurrentToken()
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null) return null;

            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
            if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer "))
                return null;

            return authHeader.Substring(7);
        }
    }
}
