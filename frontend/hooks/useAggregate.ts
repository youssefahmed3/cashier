"use client";
import Cookies from 'js-cookie';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { redirect, useRouter } from 'next/navigation';
import {
    registerUser,
    loginUser,
    confirm2FA,
    forgotPassword,
    validateResetCode,
    resetPassword,
    fetchUser,
    getTenantId,
} from '../lib/api/auth';
import { toast } from 'sonner';

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
import { FullUserType, UserType } from '@/types/types';
import { getFullUserData } from '@/lib/api/aggregate';
import { useAuth } from './useAuth';

export const useAggregate = () => {


    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const { user } = useAuth();

    // Check if user is authenticated based on token presence
    const isAuthenticated =
        typeof window !== "undefined" ? !!token : false;

    // check if user is admin that has muliple roles
    const isAdmin = user?.roles.includes("admin")




    const getFullUserDataQuery = useQuery<FullUserType, Error>({
        queryKey: ['full-user'],
        queryFn: async () => {
            if (!token) throw new Error("No auth token found");
            return await getFullUserData(token);
        },
        enabled: !!token,
        retry: false,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });


    return {
        isAuthenticated,

        getFullUserData: getFullUserDataQuery.data,
        isLoading: getFullUserDataQuery.isLoading,
        error: getFullUserDataQuery.error
    };
};