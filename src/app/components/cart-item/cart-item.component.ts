import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartItem } from '../../interfaces/cart.interface';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart-item.component.html'
})
export class CartItemComponent {
  item = input.required<CartItem>();
  remove = output<number>();
}
