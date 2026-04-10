import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);
    let token: string | null = null;

    if (isPlatformBrowser(platformId)) {
        token = localStorage.getItem('auth_token');
    }

    if (token) {
        const clonedReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
                                .set('Accept', 'application/json')
        });
        return next(clonedReq);
    }

    return next(req);
};
