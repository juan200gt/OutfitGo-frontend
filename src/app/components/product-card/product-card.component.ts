import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../interfaces/product.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  product = input.required<Product>();
  addToCart = output<Product>();
}
