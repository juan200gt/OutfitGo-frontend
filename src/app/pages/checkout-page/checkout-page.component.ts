import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CurrencyPipe } from '@angular/common';
import { UserAddress } from '../../interfaces/address.interface';
import { AddressSelectorComponent } from '../address-selector/address-selector.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-checkout-page',
    standalone: true,
    imports: [AddressSelectorComponent, CurrencyPipe, TranslateModule], 
    templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent implements OnInit {
    cartService = inject(CartService);
    authService = inject(AuthService);
    router = inject(Router);
    #translate = inject(TranslateService);

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
            this.#translate.get('CHECKOUT.SELECT_ADDRESS_ERROR').subscribe(msg => alert(msg));
            return;
        }

        this.isProcessing.set(true);

        const payload = {
            address_id: this.selectedAddress()?.id
        };

        this.cartService.checkout(payload).subscribe({
            next: (response: any) => {
                if (response.url) {
                    window.location.href = response.url;
                }
            },
            error: (err) => {
                this.isProcessing.set(false);
                console.error('Stripe error:', err);
                this.#translate.get('CHECKOUT.STRIPE_ERROR').subscribe(msg => alert(msg));
            }
        });
    }
}