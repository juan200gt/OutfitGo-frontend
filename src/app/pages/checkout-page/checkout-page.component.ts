import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CheckoutFormComponent } from '../../components/checkout-form/checkout-form.component';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-checkout-page',
    standalone: true,
    imports: [CheckoutFormComponent, CurrencyPipe],
    templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent implements OnInit {
    cartService = inject(CartService);
    authService = inject(AuthService);
    router = inject(Router);

    isProcessing = signal(false);

    ngOnInit(): void {
        if (!this.authService.currentUser()) {
            this.router.navigate(['/login']);
            return;
        }

        if (this.cartService.cartItems().length === 0) {
            this.router.navigate(['/cart']);
        }
    }

    handlePayment(formData: any): void {
        this.isProcessing.set(true);

        // Mapeamos los campos al formato que espera el Backend
        const payload = {
            direccion_envio: formData.shippingAddress,
            // Aquí podríamos añadir más campos si el backend los necesitara en el futuro
        };

        this.cartService.checkout(payload).subscribe({
            next: (response) => {
                this.isProcessing.set(false);
                this.router.navigate(['/checkout/success'], { state: { message: response.message, order: response.order } });
            },
            error: (err) => {
                this.isProcessing.set(false);
                console.error('Error en el pago:', err);
            }
        });
    }
}
