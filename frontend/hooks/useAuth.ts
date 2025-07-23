"use client";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
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
            if (data.isSuccess) {
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
        onSuccess: (data) => {
            if (data.isSuccess) {
                if (data.message === '2FA required') {
                    // Store temporary token for 2FA
                    localStorage.setItem('tempToken', data.token);
                    localStorage.setItem('tempRefreshToken', data.refreshToken);
                    router.push('/confirmTwoFactorAuth');
                } else {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('refreshToken', data.refreshToken);
                    /* The router here is not correct i know */
                    /* TODO: fix the router depend on the role or the data fetching */
                    router.push('/dashboard');
                }
            }
        },
        onError: (error) => {
            console.error('Login error:', error.message);
        },
    });

    // Confirm 2FA mutation
    const confirm2FAMutation = useMutation<ApiResponse, Error, Confirm2FADto>({
        mutationFn: confirm2FA,
        onSuccess: (data) => {
            if (data.isSuccess) {
                localStorage.removeItem('tempToken');
                localStorage.removeItem('tempRefreshToken');
                localStorage.setItem('token', data.token);
                localStorage.setItem('refreshToken', data.refreshToken);
                /* TODO: fix the router depend on the role or the data fetching */
                router.push('/dashboard');
            }
        },
        onError: (error) => {
            console.error('2FA confirmation error:', error.message);
        },
    });

    // Forgot password mutation
    const forgotPasswordMutation = useMutation<ForgotPasswordResponse, Error, ForgotPasswordDto>({
        mutationFn: forgotPassword,
        onSuccess: (data) => {
            if (data.success) {
                router.push('/validateResetPasswordCode');
            }
        },
        onError: (error) => {
            console.error('Forgot password error:', error.message);
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
                localStorage.setItem('refreshToken', data.refreshToken);
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
            localStorage.removeItem('refreshToken');
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

        confirm2FA: confirm2FAMutation.mutate,
        confirm2FAStatus: confirm2FAMutation.status,
        confirm2FAError: confirm2FAMutation.error,

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