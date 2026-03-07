import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { LoginCredentials } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginFormComponent],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  #router = inject(Router);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  onLogin(credentials: LoginCredentials) {
    this.loading.set(true);
    this.error.set(null); // Limpia posibles errores previos

    // Simulación de llamada a backend
    setTimeout(() => {
      this.loading.set(false);
      this.error.set(null);
      this.#router.navigate(['/products']);
    }, 2000);
  }
}
