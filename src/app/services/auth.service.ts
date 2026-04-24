import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, catchError } from 'rxjs';
import { LoginCredentials, RegisterCredentials, AuthResponse, User, ResetPasswordData, MessageResponse } from '../interfaces/auth.interface';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    #http = inject(HttpClient);
    #platformId = inject(PLATFORM_ID);
    #apiUrl = environment.apiUrl;

    currentUser = signal<User | null>(null);

    constructor() {
        this.initializeAuth();
    }

    private initializeAuth() {
        if (isPlatformBrowser(this.#platformId)) {
            const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
            if (token) {
                this.loadCurrentUser().subscribe({
                    error: () => console.log('No se pudo recuperar la sesión inicial')
                });
            }
        }
    }

    loadCurrentUser(): Observable<User | null> {
        return this.#http.get<User>(`${this.#apiUrl}/user`).pipe(
            tap(user => {
                this.currentUser.set(user);
            }),
            catchError(error => {
                console.error('Sesión caducada o token inválido', error);
                if (isPlatformBrowser(this.#platformId)) {
                    localStorage.removeItem('auth_token');
                    sessionStorage.removeItem('auth_token');
                }
                this.currentUser.set(null);
                return of(null);
            })
        );
    }

    login(credentials: LoginCredentials): Observable<AuthResponse> {
        return this.#http.post<AuthResponse>(`${this.#apiUrl}/login`, credentials).pipe(
            tap(response => {
                if (response.access_token && isPlatformBrowser(this.#platformId)) {
                    const storage = credentials.remember ? localStorage : sessionStorage;
                    storage.setItem('auth_token', response.access_token);
                    this.currentUser.set(response.user);
                }
            })
        );
    }

    register(credentials: RegisterCredentials): Observable<AuthResponse> {
        return this.#http.post<AuthResponse>(`${this.#apiUrl}/register`, credentials).pipe(
            tap(response => {
                // Solo iniciamos sesión si el servidor nos devuelve un token (por ejemplo, si la verificación de email está desactivada)
                if (response.access_token && isPlatformBrowser(this.#platformId)) {
                    const storage = credentials.remember ? localStorage : sessionStorage;
                    storage.setItem('auth_token', response.access_token);
                    this.currentUser.set(response.user);
                }
            })
        );
    }

    logout(): Observable<any> {
        return this.#http.post(`${this.#apiUrl}/logout`, {}).pipe(
            tap(() => {
                if (isPlatformBrowser(this.#platformId)) {
                    localStorage.removeItem('auth_token');
                    sessionStorage.removeItem('auth_token');
                }
                this.currentUser.set(null);
            }),
            catchError(() => {
                if (isPlatformBrowser(this.#platformId)) {
                    localStorage.removeItem('auth_token');
                    sessionStorage.removeItem('auth_token');
                }
                this.currentUser.set(null);
                return of(null);
            })
        );
    }

    loginWithGoogle(): void {
        if (isPlatformBrowser(this.#platformId)) {
            window.location.href = `${this.#apiUrl}/auth/google/redirect`;
        }
    }

    saveToken(token: string, remember: boolean = true): Observable<User | null> {
        if (isPlatformBrowser(this.#platformId)) {
            const storage = remember ? localStorage : sessionStorage;
            storage.setItem('auth_token', token);
        }
        return this.loadCurrentUser();
    }

    updateProfile(data: any): Observable<{ message: string, user: User }> {
        return this.#http.put<{ message: string, user: User }>(`${this.#apiUrl}/user/profile`, data).pipe(
            tap(response => {
                this.currentUser.set(response.user);
            })
        );
    }

    sendForgotPasswordLink(email: string): Observable<MessageResponse> {
        return this.#http.post<MessageResponse>(`${this.#apiUrl}/forgot-password`, { email });
    }

    resetPassword(data: ResetPasswordData): Observable<MessageResponse> {
        return this.#http.post<MessageResponse>(`${this.#apiUrl}/reset-password`, data);
    }
}