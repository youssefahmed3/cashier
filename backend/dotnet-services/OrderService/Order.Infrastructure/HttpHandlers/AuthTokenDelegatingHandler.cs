using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Order.Core.Interfaces.Services;

namespace Order.Infrastructure.HttpHandlers
{
    public class AuthTokenDelegatingHandler : DelegatingHandler
    {
        private readonly IUserContextService _currentUserService;
        private readonly ILogger<AuthTokenDelegatingHandler> _logger;

        public AuthTokenDelegatingHandler(IUserContextService currentUserService, ILogger<AuthTokenDelegatingHandler> logger)
        {
            _currentUserService = currentUserService;
            _logger = logger;
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var token = _currentUserService.GetCurrentToken();

            if (!string.IsNullOrEmpty(token))
            {
                request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                _logger.LogDebug("Added Authorization header to outgoing request: {Url}", request.RequestUri);
            }
            else
            {
                _logger.LogWarning("No token available for outgoing request: {Url}", request.RequestUri);
            }

            return await base.SendAsync(request, cancellationToken);
        }

    }
}
