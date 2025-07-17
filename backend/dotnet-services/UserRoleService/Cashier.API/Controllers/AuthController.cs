namespace Cashier.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthenticationService _authService) : ControllerBase
    {
        // POST: api/auth/send-registration-link
        [HttpPost("send-registration-link")]
        public async Task<IActionResult> SendRegistrationLink([FromBody] string email)
        {
            var result = await _authService.SendRegistrationLinkAsync(email);
            return Ok(new
            {
                success = result.Success,
                message = result.Message
            });
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            var result = await _authService.RegisterAsync(model);
            return Ok(new
            {
                success = result.IsSuccess,
                message = result.Message,
                errors = result.Errors
            });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto model)
        {
            var result = await _authService.LoginAsync(model);
            return Ok(result);
        }

        // POST: api/auth/confirm-2fa
        [HttpPost("confirm-2fa")]
        public async Task<IActionResult> Confirm2FA([FromBody] Confirm2FADto model)
        {
            var result = await _authService.ConfirmTwoFactorAsync(model.Email, model.Code);
            return Ok(result);
        }

        // POST: api/auth/refresh
        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
        {
            var result = await _authService.RefreshTokenAsync(refreshToken);
            return Ok(result);
        }

        // POST: api/auth/logout
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] int userId)
        {
            await _authService.LogoutAsync(userId);
            return Ok(new
            {
                success = true,
                message = "Logged out successfully."
            });
        }

        // POST: api/auth/forgot-password
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            var (success, message) = await _authService.ForgotPasswordAsync(model.Email);
            return Ok(new
            {
                success,
                message
            });
        }

        // POST: api/auth/validate-verification-code
        [HttpPost("validate-verification-code")]
        public IActionResult ValidateVerificationCode([FromBody] ValidateVerificationCodeDto model)
        {
            var result = _authService.ValidateVerificationCode(model.Email, model.VerificationCode);
            return Ok(new
            {
                success = result.Success,
                message = result.Message
            });
        }

        // POST: api/auth/reset-password
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            var result = await _authService.ResetPasswordAsync(model.Email, model.Code, model.NewPassword);
            return Ok(new
            {
                success = result.Success,
                message = result.Message,
                token = result.Token,
                refreshToken = result.refereshToken
            });
        }
    }
}
