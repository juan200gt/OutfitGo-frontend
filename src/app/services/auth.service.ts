import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, delay, throwError } from 'rxjs';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../interfaces/auth.interface';
import { MOCK_USERS } from '../mocks/mock-data';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    #http = inject(HttpClient);
    #platformId = inject(PLATFORM_ID);
    #apiUrl = 'http://35.172.39.217:8000/api';

    currentUser = signal<User | null>(null);

    login(credentials: LoginCredentials): Observable<AuthResponse> {
        // TODO: Descomentar cuando la API vuelva
        /* return this.#http.post<AuthResponse>(`${this.#apiUrl}/login`, credentials).pipe(
            tap(response => {
                if (response.access_token) {
                    localStorage.setItem('auth_token', response.access_token);
                    this.currentUser.set(response.user);
                }
            })
        ); */

        const user = MOCK_USERS.find(u => u.email === credentials.email);
        if (user && (credentials.password === 'admin' || credentials.password === 'password123')) {
            const mockToken = 'mock_jwt_token_12345';
            if (isPlatformBrowser(this.#platformId)) {
                localStorage.setItem('auth_token', mockToken);
            }
            this.currentUser.set(user);
            return of({ message: 'Inicio simulado', user, access_token: mockToken, token_type: 'Bearer' }).pipe(delay(500));
        } else {
            return throwError(() => ({ error: { message: 'Las credenciales proporcionadas son incorrectas.' } })).pipe(delay(500));
        }
    }

    register(credentials: RegisterCredentials): Observable<AuthResponse> {
        // TODO: Descomentar cuando la API vuelva
        /* return this.#http.post<AuthResponse>(`${this.#apiUrl}/register`, credentials).pipe(
            tap(response => {
                if (response.access_token && isPlatformBrowser(this.#platformId)) {
                    localStorage.setItem('auth_token', response.access_token);
                    this.currentUser.set(response.user);
                }
            })
        ); */

        const newUser: User = { id: Date.now(), name: credentials.name, email: credentials.email };
        const mockToken = 'mock_jwt_token_67890';
        if (isPlatformBrowser(this.#platformId)) {
            localStorage.setItem('auth_token', mockToken);
        }
        this.currentUser.set(newUser);
        return of({ message: 'Usuario registrado exitosamente', user: newUser, access_token: mockToken, token_type: 'Bearer' }).pipe(delay(500));
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
