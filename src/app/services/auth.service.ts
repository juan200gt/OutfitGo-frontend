import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, delay, throwError } from 'rxjs';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../interfaces/auth.interface';
import { MOCK_USERS } from '../mocks/mock-data';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    #http = inject(HttpClient);
    #platformId = inject(PLATFORM_ID);
    #apiUrl = environment.apiUrl + '/api';

    currentUser = signal<User | null>(null);

    login(credentials: LoginCredentials): Observable<AuthResponse> {
        return this.#http.post<AuthResponse>(`${this.#apiUrl}/login`, credentials).pipe(
            tap(response => {
                if (response.access_token) {
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
                localStorage.removeItem('auth_token');
                this.currentUser.set(null);
            })
        );
    }
}
