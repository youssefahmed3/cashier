"use client";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { redirect, useRouter } from 'next/navigation';
import {
    registerUser,
    loginUser,
    confirm2FA,
    forgotPassword,
    validateResetCode,
    resetPassword,
} from '../lib/api/auth';
import {
    RegisterDto,
    LoginDto,
    Confirm2FADto,
    ForgotPasswordDto,
    ValidateResetCodeDto,
    ResetPasswordDto,
    ApiResponse,
    ForgotPasswordResponse,
    ResetPasswordResponse,
    TwoFactorAuthApiResponse
} from '@/types/dtos';

export const useAuth = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    // Check if user is authenticated based on token presence
    const isAuthenticated =
        typeof window !== "undefined" ? !!localStorage.getItem("token") : false;

    // Register mutation
    const registerMutation = useMutation<ApiResponse, Error, RegisterDto>({
        mutationFn: registerUser,
        onSuccess: (data) => {
            if (data.success) {
                router.push('/login');
            }
        },
        onError: (error) => {
            console.error('Registration error:', error.message);
        },
    });

    // Login mutation
    const loginMutation = useMutation<ApiResponse, Error, LoginDto>({
        mutationFn: loginUser,
        onSuccess: (data, variables) => {
            if (data.requires2FA) {
                localStorage.setItem("2fa-email", variables.email);
                router.push("/confirmTwoFactorAuth");
            } else if (data.success) {
                console.log("Login successful");
                localStorage.setItem("token", data.token!);
                localStorage.setItem("refresh-token", data.refreshToken!);
                redirect('/tenant/dashboard'); // Redirect to the dashboard or home page
            }
        },
    });

    // Confirm 2FA mutation
    const confirm2FAMutation = useMutation<TwoFactorAuthApiResponse, Error, Confirm2FADto>({
        mutationFn: confirm2FA,
        onSuccess: (data) => {
            if (data.isSuccess) {
                localStorage.removeItem("2fa-email");
                localStorage.setItem('token', data.token);
                localStorage.setItem('refresh-Token', data.refreshToken);
                /* TODO: fix the router depend on the role or the data fetching */
                router.push('/login');
            }
        },
        onError: (error) => {
            console.error('2FA confirmation error:', error.message);
        },
    });


 const forgotPasswordMutation = useMutation<ForgotPasswordResponse, Error, ForgotPasswordDto>({
    mutationFn: forgotPassword,
    onSuccess: (data, variables) => {
      if (data.success) {
        localStorage.setItem("user-email", variables.email);
        // toast.success(data.message || "Reset code sent.");
        router.push('/validateResetPasswordCode');
      } else {
        // toast.error(data.message || "Something went wrong.");
      }
    },
    onError: (error) => {
    //   toast.error(error.message || "Failed to send reset code.");
      console.error("Forgot password error:", error.message);
    },
  });

    // Validate reset code mutation
    const validateResetCodeMutation = useMutation<
        { success: boolean; message: string },
        Error,
        ValidateResetCodeDto
    >({
        mutationFn: validateResetCode,
        onSuccess: (data) => {
            if (data.success) {
                router.push('/resetPassword');
            }
        },
        onError: (error) => {
            console.error('Validate reset code error:', error.message);
        },
    });

    // Reset password mutation
    const resetPasswordMutation = useMutation<ResetPasswordResponse, Error, ResetPasswordDto>({
        mutationFn: resetPassword,
        onSuccess: (data) => {
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('refresh-token', data.refreshToken);
                localStorage.removeItem("user-email")
                localStorage.removeItem("reset-code")
                router.push('/login');
            }
        },
        onError: (error) => {
            console.error('Reset password error:', error.message);
        },
    });

    // Logout mutation
    const logoutMutation = useMutation<void, Error>({
        mutationFn: async () => {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh-token');
            localStorage.removeItem('tempToken');
            localStorage.removeItem('tempRefreshToken');
        },
        onSuccess: () => {
            queryClient.clear();
            router.push('/login');
        },
        onError: (error) => {
            console.error('Logout error:', error.message);
        },
    });

    return {
        isAuthenticated,

        register: registerMutation.mutate,
        registerStatus: registerMutation.status,
        registerError: registerMutation.error,

        login: loginMutation.mutate,
        loginStatus: loginMutation.status,
        loginError: loginMutation.error,
        isLoading: loginMutation.isPending,

        confirm2FA: confirm2FAMutation.mutate,
        confirm2FAStatus: confirm2FAMutation.status,
        confirm2FAError: confirm2FAMutation.error,
        isConfirm2FALoading: confirm2FAMutation.isPending,

        forgotPassword: forgotPasswordMutation.mutate,
        forgotPasswordStatus: forgotPasswordMutation.status,
        forgotPasswordError: forgotPasswordMutation.error,

        validateResetCode: validateResetCodeMutation.mutate,
        validateResetCodeStatus: validateResetCodeMutation.status,
        validateResetCodeError: validateResetCodeMutation.error,

        resetPassword: resetPasswordMutation.mutate,
        resetPasswordStatus: resetPasswordMutation.status,
        resetPasswordError: resetPasswordMutation.error,

        logout: logoutMutation.mutate,
        logoutStatus: logoutMutation.status,
        logoutError: logoutMutation.error,
    };
};