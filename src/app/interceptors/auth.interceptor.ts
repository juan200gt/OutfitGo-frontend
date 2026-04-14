import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);
    const router = inject(Router);
    const authService = inject(AuthService);
    
    let token: string | null = null;

    if (isPlatformBrowser(platformId)) {
        token = localStorage.getItem('auth_token');
    }

    let authReq = req;
    if (token) {
        authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
                                .set('Accept', 'application/json')
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && isPlatformBrowser(platformId)) {
                
                localStorage.removeItem('auth_token');
                authService.currentUser.set(null);
                
                router.navigate(['/login'], { queryParams: { expired: 'true' } });
            }
            
            return throwError(() => error);
        })
    );
};