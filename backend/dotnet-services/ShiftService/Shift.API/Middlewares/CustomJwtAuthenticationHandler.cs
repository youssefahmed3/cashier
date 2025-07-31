using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace Shift.API.Middleware
{
    public class CustomJwtAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly ILogger<CustomJwtAuthenticationHandler> _logger;

        public CustomJwtAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory loggerFactory,
            UrlEncoder encoder,
            ISystemClock clock)
            : base(options, loggerFactory, encoder, clock)
        {
            _logger = loggerFactory.CreateLogger<CustomJwtAuthenticationHandler>();
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            _logger.LogDebug("CustomJwtAuthenticationHandler started HandleAuthenticateAsync.");

            // Check if the user was already set by your JWT middleware
            if (Context.User?.Identity != null && Context.User.Identity.IsAuthenticated)
            {
                _logger.LogInformation("User is authenticated via JWT middleware. Name: {UserName}",
                    Context.User.Identity.Name ?? "[null]");

                // Create authentication ticket from the existing user
                var ticket = new AuthenticationTicket(Context.User, Scheme.Name);
                return Task.FromResult(AuthenticateResult.Success(ticket));
            }

            _logger.LogWarning("No authenticated user found from JWT middleware.");
            return Task.FromResult(AuthenticateResult.NoResult());
        }
    }

}
