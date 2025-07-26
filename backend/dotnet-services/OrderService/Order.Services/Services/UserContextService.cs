using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
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
    }
}
