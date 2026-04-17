import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink, CartItemComponent, TranslateModule],
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

  handleUpdateQuantity(event: { id: number, cantidad: number }): void {
    this.cartService.updateQuantity(event.id, event.cantidad).subscribe();
  }
}
