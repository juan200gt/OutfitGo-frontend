import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-detail-info',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail-info.component.html'
})
export class ProductDetailInfoComponent {
  product = input.required<Product>();
  
  selectedSize = signal<string | null>(null);
  selectedColor = signal<string | null>(null);
  quantity = signal<number>(1);
  
  activeImage = signal<string>('');
  
  addToCart = output<{ product: Product, quantity: number, size: string, color: string }>();

  constructor() {
    effect(() => {
      const p = this.product();
      if (p) {
        this.activeImage.set(p.image);
        this.selectedSize.set(null);
        this.selectedColor.set(null);
        this.quantity.set(1);
      }
    });
  }

  increase() {
    if (this.quantity() < this.product().stock) {
      this.quantity.update(q => q + 1);
    }
  }

  decrease() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  submit() {
    if (this.selectedSize() && this.selectedColor()) {
      this.addToCart.emit({
        product: this.product(),
        quantity: this.quantity(),
        size: this.selectedSize()!,
        color: this.selectedColor()!
      });
    }
  }
}