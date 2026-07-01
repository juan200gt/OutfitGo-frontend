import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Si ya hay un usuario cargado en memoria, dejamos pasar
  if (authService.currentUser() !== null) {
    return true;
  }

  // Si hay token pero el usuario aún no se cargó, intentamos cargarlo antes de decidir
  let hasToken = false;
  if (isPlatformBrowser(platformId)) {
    hasToken = !!(localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token'));
  }

  if (hasToken) {
    return authService.loadCurrentUser().pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        }
        router.navigate(['/login']);
        return false;
      })
    );
  }

  router.navigate(['/login']);
  return false;
};