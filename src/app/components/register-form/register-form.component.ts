import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RegisterCredentials } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-form.component.html'
})
export class RegisterFormComponent {
  isLoading = input<boolean>(false);
  errorMessage = input<string | null>(null);

  submitRegister = output<RegisterCredentials>();

  registerForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password_confirmation: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.submitRegister.emit({
        name: this.registerForm.controls.name.value,
        email: this.registerForm.controls.email.value,
        password: this.registerForm.controls.password.value,
        password_confirmation: this.registerForm.controls.password_confirmation.value
      });
    }
  }
}
