﻿namespace Cashier.Shared.DTOS.Identity
{
    public class ResetPasswordDto
    {
        public string Email { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
    }
}
