import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // --- Estado Global Básico (Simulado/Gestionado por este Smart Component) ---
  // En el futuro, estos datos podrían venir inyectados desde un AuthService o CartService
  isUserLoggedIn = signal<boolean>(false);
  globalCartCount = signal<number>(0);
  isSearchVisible = signal<boolean>(false);

  // Manejador del evento emitido por el Dumb Component
  handleSearchEvent(query: string) {
    console.log('Búsqueda ejecutada desde Header dumb comp:', query);
    // Aquí iría la lógica (ej: redigir a la ruta /search?q=...)
  }

  handleToggleSearch() {
    this.isSearchVisible.update(visible => !visible);
  }
}
