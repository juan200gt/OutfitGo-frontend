import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password-page.component.html'
})
export class ResetPasswordPageComponent implements OnInit {
  #authService = inject(AuthService);
  #route = inject(ActivatedRoute);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  token: string = '';
  email: string = '';

  resetForm = new FormGroup({
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.min(8)] }),
    password_confirmation: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  ngOnInit() {
    this.#route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';

      if (!this.token || !this.email) {
        this.errorMessage.set('Enlace inválido o expirado. Por favor, solicita uno nuevo.');
      }
    });
  }

  onSubmit() {
    if (this.resetForm.valid && this.token && this.email) {
      if (this.resetForm.controls.password.value !== this.resetForm.controls.password_confirmation.value) {
        this.errorMessage.set('Las contraseñas no coinciden.');
        return;
      }

      this.isLoading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      const data = {
        token: this.token,
        email: this.email,
        password: this.resetForm.controls.password.value,
        password_confirmation: this.resetForm.controls.password_confirmation.value
      };

      this.#authService.resetPassword(data).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.successMessage.set(response.message);
          this.resetForm.reset();
        },
        error: (err) => {
          this.isLoading.set(false);
          if (err.error && err.error.errors) {
            const firstError = Object.values(err.error.errors)[0] as string[];
            this.errorMessage.set(firstError[0]);
          } else if (err.error && err.error.message) {
            this.errorMessage.set(err.error.message);
          } else {
            this.errorMessage.set('Error al restablecer la contraseña. Inténtalo de nuevo.');
          }
        }
      });
    }
  }
}

