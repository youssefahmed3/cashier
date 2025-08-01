import { useAuth } from "@/hooks/useAuth";
import { ApiResponse, AssignRoleDto, Confirm2FADto, ForgotPasswordDto, ForgotPasswordResponse, LoginDto, RegisterDto, ResetPasswordDto, ResetPasswordResponse, TwoFactorAuthApiResponse, ValidateResetCodeDto } from "@/types/dtos";
import { UserType, validateTokenResult } from "@/types/types";

export async function fetchUser(token: string): Promise<UserType> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/UserRole/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  const data = await res.json();
  console.log(data);

  return {
    ...data,
    roles: data.roles.map((r: string) => r.toLowerCase()),
  };
}

/* http://localhost:8001/auth/api/auth/register  */
export async function getTenantId(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/UserRole/current-tenant-id`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Something went wrong");
  return json;
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

// GET: api/userrole/users
export async function getAllUsers(token: string) : Promise<UserType[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/UserRole/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Something went wrong");
  return json;
}


/* GET: api/userrole/roles */
export async function getAllRoles(token: string) : Promise<{
  id: number;
  name: string;
}[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/UserRole/roles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Something went wrong");
  return json;
}

/* POST: userrole/users/suspend/ */
export async function suspendUser(token: string, userId: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/UserRole/users/suspend/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Something went wrong");
  return json;
}


/* POST: /userrole/assign-role */
export async function assignRole(token: string, assignRoleDto: AssignRoleDto) {
  console.log("test");
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/UserRole/assign-role`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(assignRoleDto)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Something went wrong");
  return json;
}


/* POST: /api/token/validate */
export async function validateToken(token: string) : Promise<validateTokenResult> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/token/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Something went wrong");
  // console.log(json);
  return json;
}