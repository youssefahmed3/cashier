namespace Cashier.Services.Services
{
    public class AuthenticationService(UserManager<AppUser> _userManager,
        SignInManager<AppUser> _signInManager,
        IEmailSender _emailSender, IOptions<JwtOptions> _jwtOptions,
        IConfiguration _configuration, IMapper _mapper,
        TokenValidationParameters _tokenValidationParameters
        , IMemoryCache _memoryCache) : IAuthenticationService
    {
        private readonly string baseFrontendUrl = _configuration["FrontBaseUrl"]!;

        // Sends a registration link to the user's email if the email is not already registered
        public async Task<(bool Success, string Message)> SendRegistrationLinkAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return (false, "Email is required.");

            var existingUser = await _userManager.FindByEmailAsync(email);
            if (existingUser != null)
                return (false, "An account already exists with this email.");

            var registrationLink = $"{baseFrontendUrl}/register?email={Uri.EscapeDataString(email)}";

            var emailMessage = new Email
            {
                To = email,
                Subject = "Register for Your Account",
                Body = EmailBuilder.BuildRegistrationEmail(registrationLink)
            };

            await _emailSender.SendEmailAsync(emailMessage);

            return (true, "Registration link sent successfully.");
        }

        // Registers a new user with provided data and password
        public async Task<RegisterResponseDto> RegisterAsync(RegisterDto model)
        {
            var user = _mapper.Map<AppUser>(model);
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return new RegisterResponseDto
                {
                    Errors = result.Errors.Select(e => e.Description),
                    Message = "An error happen when you registered"
                };
            }
            return new RegisterResponseDto { IsSuccess = true, Message = "Registration successful." };
        }

        // Logs the user in by validating credentials and sending 2FA code if required
        public async Task<LoginResponseDto> LoginAsync(LoginDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                return new LoginResponseDto { Errors = ["Invalid credentials."] };

            if (user.AccessFailedCount == 0 && user.TwoFactorEnabled == false)
            {
                var code = GenerateVerificationCode();
                _memoryCache.Set($"2fa:{user.Email}", code, TimeSpan.FromMinutes(10));

                var email = new Email
                {
                    To = user.Email ?? "Unknown@gmail.com",
                    Subject = "Your 2FA Code",
                    Body = EmailBuilder.Build2FAEmail(code)
                };

                await _emailSender.SendEmailAsync(email);

                return new LoginResponseDto { Requires2FA = true , Message = "Please confirm your email" };
            }

            return GenerateTokensAsync(user);
        }

        // Confirms 2FA code and returns access and refresh tokens if successful
        public async Task<Confirm2FAResponseDto> ConfirmTwoFactorAsync(string email, string code)
        {
            if (!_memoryCache.TryGetValue($"2fa:{email}", out string? storedCode) || storedCode != code)
                return new Confirm2FAResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid verification code",
                    Token = "",
                    RefreshToken = "",
                    Expiration = default
                };

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return new Confirm2FAResponseDto
                {
                    IsSuccess = false,
                    Message = "User not found"
                };

            _memoryCache.Remove($"2fa:{email}");
            user.IsFirstLogin = false;
            user.EmailConfirmed = true;
            user.TwoFactorEnabled = true;
            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
                return new Confirm2FAResponseDto
                {
                    IsSuccess = false,
                    Message = "Failed to update user settings"
                };


            var tokens = GenerateTokensAsync(user);

            return new Confirm2FAResponseDto
            {
                IsSuccess = true,
                Message = "2FA completed successfully",
                Token = tokens.Token,
                RefreshToken = tokens.RefreshToken,
                Expiration = tokens.Expiration
            };
        }

        // Validates refresh token and issues new access and refresh tokens
        public async Task<LoginResponseDto> RefreshTokenAsync(string refreshToken)
        {
            var handler = new JwtSecurityTokenHandler();
            var validationParams = _tokenValidationParameters.Clone();
            validationParams.ValidateLifetime = false;

            try
            {
                var principal = handler.ValidateToken(refreshToken, validationParams, out var validatedToken);
                if (!(validatedToken is JwtSecurityToken jwtToken) ||
                    !jwtToken.Claims.Any(c => c.Type == "token_type" && c.Value == "refresh"))
                    return new LoginResponseDto { Errors = ["Invalid refresh token"] };

                var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var user = await _userManager.FindByIdAsync(userId ?? "");

                return user == null
                    ? new LoginResponseDto { Errors = new[] { "User not found" } }
                    : GenerateTokensAsync(user);
            }
            catch
            {
                return new LoginResponseDto { Errors = new[] { "Invalid refresh token" } };
            }
        }

        // Logs the user out by signing them out
        public async Task LogoutAsync(int userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user != null)
                await _signInManager.SignOutAsync();
        }

        // Helper method: Generates access and refresh tokens for authenticated user
        private LoginResponseDto GenerateTokensAsync(AppUser user)
        {
            var accessToken = GenerateAccessToken(user);
            var refreshToken = GenerateRefreshToken(user);

            return new LoginResponseDto
            {
                Token = accessToken,
                RefreshToken = refreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(15),
                IsSuccess = true
            };
        }

        // Helper method: Generates JWT access token with claims
        private string GenerateAccessToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Email, user.Email??"Unknown@gmail.com"),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            var roles = _userManager.GetRolesAsync(user).Result;
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Value.SecretKey));
            var token = new JwtSecurityToken(
                issuer: _jwtOptions.Value.Issuer,
                audience: _jwtOptions.Value.Audience,
                expires: DateTime.UtcNow.AddMinutes(15),
                claims: claims,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Helper method: Generates JWT refresh token with special claim
        private string GenerateRefreshToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new("token_type", "refresh")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Value.SecretKey));
            var token = new JwtSecurityToken(
                issuer: _jwtOptions.Value.Issuer,
                audience: _jwtOptions.Value.Audience,
                expires: DateTime.UtcNow.AddDays(_jwtOptions.Value.ExpirationInDays),
                claims: claims,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Sends a password reset verification code to user's email
        public async Task<(bool Success, string Message)> ForgotPasswordAsync(string email)
        {

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return (false, "User not found.");

            var code = GenerateVerificationCode();
            _memoryCache.Set(email, code, TimeSpan.FromMinutes(15));

            await _emailSender.SendEmailAsync(CreateVerificationEmail(email, code));
            return (true, "Verification code sent to your email.");
        }

        // Validates if the verification code sent to email is correct and not expired
        public (bool Success, string Message) ValidateVerificationCodeAsync(string email, string code)
        {
            if (!_memoryCache.TryGetValue(email, out string? storedCode) || storedCode != code)
                return (false, "Invalid or expired verification code.");
            return (true, "Verification code is valid.");
        }

        // Resets user's password if the verification code is valid, and returns new tokens
        public async Task<(bool Success, string Message, string? Token, string? refereshToken)> ResetPasswordAsync(string email, string code, string newPassword)
        {

            var validate = ValidateVerificationCodeAsync(email, code);
            if (!validate.Success)
                return (false, validate.Message, "", "");

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return (false, "User not found.", "", "");

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, resetToken, newPassword);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return (false, $"Password reset failed: {errors}", "", "");
            }

            var response = GenerateTokensAsync(user);

            return (true, "Password reset successful.", response.Token, response.RefreshToken);
        }

        // Helper method: Generates a 6-digit verification code
        private string GenerateVerificationCode() =>
          new Random().Next(100000, 999999).ToString();

        // Helper method: Builds a verification email message
        private Email CreateVerificationEmail(string email, string code) => new()
        {
            To = email,
            Subject = "Password Reset Verification Code",
            Body = EmailBuilder.BuildResetPasswordEmail(code)
        };
    }
}
