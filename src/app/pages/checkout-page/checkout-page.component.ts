import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CurrencyPipe } from '@angular/common';
import { UserAddress } from '../../interfaces/address.interface';
import { AddressSelectorComponent } from '../address-selector/address-selector.component';

@Component({
    selector: 'app-checkout-page',
    standalone: true,
    imports: [AddressSelectorComponent, CurrencyPipe], 
    templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent implements OnInit {
    cartService = inject(CartService);
    authService = inject(AuthService);
    router = inject(Router);

    isProcessing = signal(false);
    selectedAddress = signal<UserAddress | null>(null);

    ngOnInit(): void {
        if (!this.authService.currentUser()) {
            this.router.navigate(['/login']);
            return;
        }
        if (this.cartService.cartItems().length === 0) {
            this.router.navigate(['/cart']);
        }
    }

    setShippingAddress(address: UserAddress): void {
        this.selectedAddress.set(address);
    }

    procederAlPago(): void {
        if (!this.selectedAddress()) {
            alert('Por favor, selecciona una dirección de envío');
            return;
        }

        this.isProcessing.set(true);

        const payload = {
            address_id: this.selectedAddress()?.id,
            productos: this.cartService.cartItems()
        };

        this.cartService.checkout(payload).subscribe({
            next: (response) => {
                if (response.url) {
                    window.location.href = response.url;
                }
            },
            error: (err) => {
                this.isProcessing.set(false);
                console.error('Error al conectar con Stripe:', err);
                alert('Hubo un error al iniciar el pago seguro.');
            }
        });
    }
}