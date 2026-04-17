import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { LoginCredentials } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginFormComponent],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  #authService = inject(AuthService);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #translate = inject(TranslateService);

  isLoggingIn = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  prefilledEmail = signal<string | null>(null);

  constructor() {
    this.#route.queryParams.subscribe((params: any) => {
      if (params['registered'] === 'true') {
        this.success.set(this.#translate.instant('AUTH.REGISTERED_SUCCESS'));
      }
      if (params['registered'] === 'unverified') {
        this.success.set(this.#translate.instant('AUTH.REGISTERED_UNVERIFIED'));
      }
      if (params['verified'] === 'true') {
        this.success.set(this.#translate.instant('AUTH.VERIFIED_SUCCESS'));
      }
      if (params['verified'] === 'false') {
        this.error.set(this.#translate.instant('AUTH.VERIFIED_FAILED'));
      }
      if (params['email']) {
        this.prefilledEmail.set(params['email']);
      }
      
      // Capturar token de Google OAuth
      if (params['token']) {
        this.isLoggingIn.set(true);
        this.#authService.saveToken(params['token']).subscribe({
          next: () => {
            this.isLoggingIn.set(false);
            this.#router.navigate(['/']);
          },
          error: () => {
            this.isLoggingIn.set(false);
            this.error.set('Error al iniciar sesión con Google');
          }
        });
      }

      if (params['error'] === 'social_auth_failed') {
        this.error.set('La autenticación con Google ha fallado.');
      }
    });
  }

  handleLogin(credentials: LoginCredentials) {
    this.isLoggingIn.set(true);
    this.error.set(null);
    this.success.set(null);

    this.#authService.login(credentials).subscribe({
      next: () => {
        this.isLoggingIn.set(false);
        this.#router.navigate(['/']);
      },
      error: (err) => {
        this.isLoggingIn.set(false);
        if (err.error && err.error.errors && err.error.errors.email) {
          this.error.set(err.error.errors.email[0]);
        } else if (err.error && err.error.message) {
          this.error.set(err.error.message);
        } else {
          this.error.set('Usuario o contraseña incorrectos');
        }
      }
    });
  }

  handleGoogleLogin() {
    this.#authService.loginWithGoogle();
  }
}
