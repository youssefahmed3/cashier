export interface RegisterDto {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
}

export interface LoginDto {
    email: string;
    password: string;
}


export interface Confirm2FADto {
    email: string
    code: string
}

export interface ApiResponse {
    success: boolean
    message: string
    token: string
    refreshToken: string
    expiration: Date
    requires2FA?: boolean
    errors?: string[];
}

export interface TwoFactorAuthApiResponse {
    isSuccess: boolean
    message: string
    token: string
    refreshToken: string
    expiration: Date
    requires2FA?: boolean;
}

export interface ForgotPasswordDto {
    email: string
}

export interface ForgotPasswordResponse {
    success: boolean
    message: string
}

export interface ValidateResetCodeDto {
    email: string
    verificationCode: string
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

export type CreateCategoryDto = {
    name: string,
    description: string,
    inventoryId: string
}

export type CreateProductDto = {
    description: string,
    price: number,
    barcode: string,
    name: string,
    imgurl: string,
    isactive: boolean,
    categoryId?: number,
    inventoryId: string
}

export type CreateTenantDto = {
    name: string,
    is_active: boolean
}


export type UpdateTenantDto = {
    name: string,
    is_active: true
}


export type CreateBranchDto = {
    name: string,
    phone: string,
    location: string,
    tax_percentage: number
}

export type AssignRoleDto = {
    userId: number,
    roleId: number,
    tenantId: string
}