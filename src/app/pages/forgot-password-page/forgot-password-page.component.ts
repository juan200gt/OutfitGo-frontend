import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './forgot-password-page.component.html'
})
export class ForgotPasswordPageComponent {
  #authService = inject(AuthService);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  forgotForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] })
  });

  onSubmit() {
    if (this.forgotForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      this.#authService.sendForgotPasswordLink(this.forgotForm.controls.email.value).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.successMessage.set(response.message);
          this.forgotForm.reset();
        },
        error: (err) => {
          this.isLoading.set(false);
          if (err.error && err.error.errors && err.error.errors.email) {
            this.errorMessage.set(err.error.errors.email[0]);
          } else if (err.error && err.error.message) {
            this.errorMessage.set(err.error.message);
          } else {
            this.errorMessage.set('Error al enviar el enlace. Inténtalo de nuevo.');
          }
        }
      });
    }
  }
}
