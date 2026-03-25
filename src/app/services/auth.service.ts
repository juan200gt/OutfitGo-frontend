import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, catchError } from 'rxjs';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../interfaces/auth.interface';
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
        if (isPlatformBrowser(this.#platformId)) {
            const token = localStorage.getItem('auth_token');
            if (token) {
                this.loadCurrentUser().subscribe();
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
                    localStorage.setItem('auth_token', response.access_token);
                    this.currentUser.set(response.user);
                }
            })
        );
    }

    register(credentials: RegisterCredentials): Observable<AuthResponse> {
        return this.#http.post<AuthResponse>(`${this.#apiUrl}/register`, credentials).pipe(
            tap(response => {
                if (response.access_token && isPlatformBrowser(this.#platformId)) {
                    localStorage.setItem('auth_token', response.access_token);
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
                }
                this.currentUser.set(null);
            }),
            catchError(() => {
                if (isPlatformBrowser(this.#platformId)) {
                    localStorage.removeItem('auth_token');
                }
                this.currentUser.set(null);
                return of(null);
            })
        );
    }
}