import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CurrencyPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-success-page',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, CommonModule],
  templateUrl: './checkout-success-page.component.html'
})
export class CheckoutSuccessPageComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  http = inject(HttpClient);

  successMessage = signal<string>('');
  order = signal<any>(null);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const sessionId = params['session_id'];

      if (!sessionId) {
        this.router.navigate(['/']);
        return;
      }


      this.http.post<{message: string, order: any}>('https://outfitgo.duckdns.org/api/checkout/confirmar', { 
        session_id: sessionId 
      }).subscribe({
        next: (response) => {
          this.successMessage.set(response.message);
          this.order.set(response.order);
          this.isLoading.set(false);
          console.log('Pago confirmado y correo enviado');
        },
        error: (err) => {
          console.error('Error al confirmar el pago', err);
          this.successMessage.set('Hubo un problema al verificar tu pago. Si el cargo se realizó, contáctanos.');
          this.isLoading.set(false);
        }
      });
    });
  }
}