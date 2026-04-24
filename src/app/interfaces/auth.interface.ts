export interface LoginCredentials {
    email: string;
    password: string;
    remember?: boolean;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    remember?: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
    rol?: string;
}

export interface AuthResponse {
    message?: string;
    user: User;
    access_token: string;
    token_type?: string;
}

export interface ResetPasswordData {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface MessageResponse {
    message: string;
}
