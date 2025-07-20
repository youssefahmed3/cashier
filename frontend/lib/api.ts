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

export interface RegisterDto {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
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

export interface LoginDto {
  email: string;
  password: string;
}

//Confirm Two Factor Auth function
export async function confirm2FA(data: Confirm2FADto): Promise<ApiResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm-2fa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return await response.json()
}
export interface Confirm2FADto {
  email: string
  code: string
}

export interface ApiResponse {
  isSuccess: boolean
  message: string
  token: string
  refreshToken: string
  expiration: Date
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
export interface ForgotPasswordDto {
  email: string
}
export interface ForgotPasswordResponse {
  success: boolean
  message: string
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

export interface ValidateResetCodeDto {
  email: string
  verificationCode: string
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

export interface ResetPasswordDto {
  email: string
  newPassword: string
  code: string
}
export interface ResetPasswordResponse {
  success: boolean
  message: string
  token: string
  refreshToken: string
}