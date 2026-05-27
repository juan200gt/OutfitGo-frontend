import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RegisterCredentials } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './register-form.component.html'
})
export class RegisterFormComponent {
  isLoading = input<boolean>(false);
  errorMessage = input<string | null>(null);

  submitRegister = output<RegisterCredentials>();
  submitGoogle = output<void>();

  registerForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password_confirmation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    remember: new FormControl(false, { nonNullable: true }),
    // Control para gestionar la casilla de la newsletter
    newsletter: new FormControl(false, { nonNullable: true })
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.submitRegister.emit({
        name: this.registerForm.controls.name.value,
        email: this.registerForm.controls.email.value,
        password: this.registerForm.controls.password.value,
        password_confirmation: this.registerForm.controls.password_confirmation.value,
        remember: this.registerForm.controls.remember.value,
        newsletter: this.registerForm.controls.newsletter.value
      });
    }
  }
}
