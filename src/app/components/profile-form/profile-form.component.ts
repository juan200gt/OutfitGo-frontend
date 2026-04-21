import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './profile-form.component.html'
})
export class ProfileFormComponent {
  user = input<any>(null);
  isLoading = input<boolean>(false);
  successMessage = input<string | null>(null);
  errorMessage = input<string | null>(null);

  // Evento que emitimos hacia arriba
  submitProfile = output<any>();

  profileForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl(''),
  });

  constructor() {
    // Cuando nos pase los datos del usuario, rellenamos el formulario
    effect(() => {
      const u = this.user();
      if (u) {
        this.profileForm.patchValue({
          name: u.name || '',
          email: u.email || '',
        });
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      // Le pasamos los datos limpios al Smart Component
      this.submitProfile.emit(this.profileForm.value);
      this.profileForm.controls.password.setValue(''); // Limpiamos la contraseña por seguridad
    } else {
      this.profileForm.markAllAsTouched();
    }
  }
}