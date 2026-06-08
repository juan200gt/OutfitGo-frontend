import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProfileFormComponent } from '../../components/profile-form/profile-form.component';
import { AddressSelectorComponent } from '../address-selector/address-selector.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ProfileFormComponent, AddressSelectorComponent],
  templateUrl: './profile-page.component.html'
})
export class ProfilePageComponent {
  authService = inject(AuthService);

  // Estados
  isLoading = signal<boolean>(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  // Esta función se dispara cuando el hijo (el formulario) emite el evento
  handleUpdate(formData: any) {
    this.isLoading.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.authService.updateProfile(formData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Perfil actualizado correctamente.');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Error al actualizar el perfil.');
      }
    });
  }
}
