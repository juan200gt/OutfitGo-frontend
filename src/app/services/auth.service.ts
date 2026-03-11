import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginCredentials, AuthResponse, User } from '../interfaces/auth.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    #http = inject(HttpClient);
    #apiUrl = 'http://34.229.141.169:8000/api';

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

    logout(): void {
        localStorage.removeItem('auth_token');
        this.currentUser.set(null);
    }
}
