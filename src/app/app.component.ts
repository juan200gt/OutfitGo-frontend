import { Component, signal, inject, computed } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, RouterLink, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);

  isUserLoggedIn = computed(() => this.authService.currentUser() !== null);

  router = inject(Router);

    handleLogout() {
        this.authService.logout().subscribe({
            next: () => {
                this.cartService.cartItems.set([]); 
                this.router.navigate(['/']);
            },
            error: (err) => {
                console.error('El backend rechazó el cierre, pero forzamos salida local', err);
                this.cartService.cartItems.set([]); 
                this.router.navigate(['/']);
            }
        });
    }
}
