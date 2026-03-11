import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, CartItemComponent],
  templateUrl: './cart-page.component.html'
})
export class CartPageComponent implements OnInit {
  cartService = inject(CartService);

  ngOnInit(): void {
    this.cartService.loadCart();
  }

  handleRemove(id: number): void {
    this.cartService.removeItem(id).subscribe();
  }
}
