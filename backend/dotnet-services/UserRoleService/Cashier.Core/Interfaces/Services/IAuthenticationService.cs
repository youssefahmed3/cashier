namespace Cashier.Core.Interfaces.Services
{
    public interface IAuthenticationService
    {
        Task<(bool Success, string Message)> SendRegistrationLinkAsync(string email);
        Task<RegisterResponseDto> RegisterAsync(RegisterDto model);
        Task<LoginResponseDto> LoginAsync(LoginDto model);
        Task<Confirm2FAResponseDto> ConfirmTwoFactorAsync(string email, string code);
        Task<LoginResponseDto> RefreshTokenAsync(string token);
        Task LogoutAsync(int userId);
        (bool Success, string Message) ValidateVerificationCode(string email, string verificationCode);
        Task<(bool Success, string Message)> ForgotPasswordAsync(string email);
        Task<(bool Success, string Message, string? Token, string? refereshToken)> ResetPasswordAsync(string email, string code, string newPassword);
    }
}
