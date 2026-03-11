import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';
import { RegisterCredentials } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RegisterFormComponent],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  #authService = inject(AuthService);
  #router = inject(Router);

  isRegistering = signal<boolean>(false);
  error = signal<string | null>(null);

  handleRegister(credentials: RegisterCredentials) {
    this.isRegistering.set(true);
    this.error.set(null);

    this.#authService.register(credentials).subscribe({
      next: () => {
        this.isRegistering.set(false);
        this.#router.navigate(['/']);
      },
      error: (err) => {
        this.isRegistering.set(false);

        let errorMsg = 'Error genérico en el registro. Comprueba la consola.';
        if (err.error && err.error.errors) {
          const validationErrors = Object.values(err.error.errors).flat().join(', ');
          errorMsg = validationErrors;
        } else if (err.error && err.error.message) {
          errorMsg = err.error.message;
        }

        this.error.set(errorMsg);
        console.error('Detalles del error:', err);
      }
    });
  }
}
