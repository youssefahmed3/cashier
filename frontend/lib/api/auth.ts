import { ApiResponse, Confirm2FADto, ForgotPasswordDto, ForgotPasswordResponse, LoginDto, RegisterDto, ResetPasswordDto, ResetPasswordResponse, TwoFactorAuthApiResponse, ValidateResetCodeDto } from "@/types/dtos";


export async function fetchUser() {

}

//Register function
export async function registerUser(data: RegisterDto) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/register`, {
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
export async function loginUser(data: LoginDto): Promise<ApiResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const json = await res.json();

  // Don’t throw, return it to mutation to handle in `onSuccess`
  return json;
}


//Confirm Two Factor Auth function
export async function confirm2FA(data: Confirm2FADto): Promise<TwoFactorAuthApiResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/confirm-2fa`, {
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
  const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/forgot-password`, {
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
  const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/validate-verification-code`, {
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
  const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return await response.json()
}

