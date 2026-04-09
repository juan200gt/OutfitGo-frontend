import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginCredentials } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent {
  isLoading = input<boolean>(false);
  errorMessage = input<string | null>(null);
  successMessage = input<string | null>(null);
  prefilledEmail = input<string | null>(null);

  submitLogin = output<LoginCredentials>();

  loginForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  constructor() {
    effect(() => {
      const email = this.prefilledEmail();
      if (email) {
        this.loginForm.controls.email.setValue(email);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.submitLogin.emit({
        email: this.loginForm.controls.email.value,
        password: this.loginForm.controls.password.value
      });
    }
  }
}
