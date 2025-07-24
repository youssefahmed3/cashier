import { ApiResponse, Confirm2FADto, ForgotPasswordDto, ForgotPasswordResponse, LoginDto, RegisterDto, ResetPasswordDto, ResetPasswordResponse, TwoFactorAuthApiResponse, ValidateResetCodeDto } from "@/types/dtos";

//Register function
export async function registerUser(data: RegisterDto) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Registration failed");

  return json;
}


//Login function
export async function loginUser(data: LoginDto) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Login failed");

  return json;
}


//Confirm Two Factor Auth function
export async function confirm2FA(data: Confirm2FADto): Promise<TwoFactorAuthApiResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm-2fa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return await response.json()
}


//Forget Password function
export async function forgotPassword(data: ForgotPasswordDto): Promise<ForgotPasswordResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return await response.json()
}


//Validate Reset Password Code function
export async function validateResetCode(
  data: ValidateResetCodeDto
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/validate-verification-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}


//Reset Password function 
export async function resetPassword(data: ResetPasswordDto): Promise<ResetPasswordResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return await response.json()
}

