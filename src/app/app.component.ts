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
  // En el futuro, estos datos podrían venir inyectados desde un AuthService
  isUserLoggedIn = signal<boolean>(false);
}
