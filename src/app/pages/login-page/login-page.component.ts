import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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

  isLoggingIn = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  prefilledEmail = signal<string | null>(null);

  constructor() {
    this.#route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.success.set('¡Registro completado con éxito! Por favor, inicia sesión.');
      }
      if (params['email']) {
        this.prefilledEmail.set(params['email']);
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
        this.error.set('Usuario o contraseña incorrectos');
      }
    });
  }
}
