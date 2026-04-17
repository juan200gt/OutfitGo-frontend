import { Component, input, output, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-detail-info',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './product-detail-info.component.html'
})
export class ProductDetailInfoComponent {
  product = input.required<Product>();
  
  selectedSize = signal<string | null>(null);
  selectedColor = signal<string | null>(null);
  quantity = signal<number>(1);
  
  activeImage = signal<string>('');
  
  addToCart = output<{ product: Product, quantity: number, size: string, color: string }>();

  currentStock = computed(() => {
    const p = this.product();
    const size = this.selectedSize();
    const color = this.selectedColor();

    if (!p || !size || !color || !p.variants) return p?.stock || 0; // Fallback

    const variante = p.variants.find(v => v.size === size && v.color === color);
    return variante ? variante.stock : 0;
  });

  constructor() {
    effect(() => {
      const p = this.product();
      if (p) {
        this.activeImage.set(p.image);
        this.selectedSize.set(null);
        this.selectedColor.set(null);
        this.quantity.set(1);
      }
    }, { allowSignalWrites: true });
  }

  increase() {
    if (this.quantity() < this.currentStock()) {
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