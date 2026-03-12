import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout-success-page',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './checkout-success-page.component.html'
})
export class CheckoutSuccessPageComponent {
  router = inject(Router);

  successMessage = signal<string>('');
  order = signal<any>(null);

  constructor() {
    const currentNavigation = this.router.getCurrentNavigation();
    const state = currentNavigation?.extras.state;

    if (!state || !state['order']) {
      this.router.navigate(['/']);
      return;
    }

    this.successMessage.set(state['message']);
    this.order.set(state['order']);
  }
}
