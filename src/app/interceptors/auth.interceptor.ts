import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID, Injector } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);
    const router = inject(Router);
    const injector = inject(Injector);
    
    let token: string | null = null;
    let language: string | null = null;

    if (isPlatformBrowser(platformId)) {
        token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        language = localStorage.getItem('user_lang');
    }

    let clonedHeaders = req.headers.set('Accept', 'application/json');
    
    if (token) {
        clonedHeaders = clonedHeaders.set('Authorization', `Bearer ${token}`);
    }
    
    if (language) {
        clonedHeaders = clonedHeaders.set('X-Lang', language);
    }

    const authReq = req.clone({
        headers: clonedHeaders
    });

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && isPlatformBrowser(platformId)) {
                
                localStorage.removeItem('auth_token');
                sessionStorage.removeItem('auth_token');
                
                // Obtenemos AuthService de forma perezosa para evitar dependencias circulares
                const authService = injector.get(AuthService);
                authService.currentUser.set(null);
                
                // Solo redirigimos a login si el usuario está en una ruta protegida
                const protectedRoutes = ['/profile', '/mis-pedidos', '/checkout', '/favoritos'];
                const isProtectedRoute = protectedRoutes.some(route => router.url.startsWith(route));
                
                if (isProtectedRoute) {
                    router.navigate(['/login'], { queryParams: { expired: 'true' } });
                }
            }
            
            return throwError(() => error);
        })
    );
};