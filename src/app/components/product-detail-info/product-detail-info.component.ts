import { Component, input, output, signal, effect, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Product } from '../../interfaces/product.interface';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PriceChartComponent } from '../price-chart/price-chart.component';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-product-detail-info',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, PriceChartComponent, RouterLink],
  templateUrl: './product-detail-info.component.html'
})
export class ProductDetailInfoComponent {
  #router = inject(Router);
  #location = inject(Location);
  product = input.required<Product>();

  selectedSize = signal<string | null>(null);
  selectedColor = signal<string | null>(null);
  quantity = signal<number>(1);

  activeImage = signal<string>('');

  addToCart = output<{ product: Product, quantity: number, size: string, color: string, variante: any }>();
  altura: number | null = null;
  peso: number | null = null;
  tallaRecomendada = signal<string | null>(null);
  calculandoTalla = signal<boolean>(false);
  #http = inject(HttpClient);

  currentStock = computed(() => {
    const p = this.product();
    const size = this.selectedSize();
    const color = this.selectedColor();
    if (!p || !size || !color || !p.variants) return p?.stock || 0;
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
  goBack() {
    this.#location.back();
  }
  submit() {
    if (this.selectedSize() && this.selectedColor()) {
      const p = this.product();
      const size = this.selectedSize()!;
      const color = this.selectedColor()!;
      // Buscamos la variante exacta que coincide con esa talla y color
      const varianteExacta = p.variants?.find(v => v.size === size && v.color === color);
      this.addToCart.emit({
        product: p,
        quantity: this.quantity(),
        size: size,
        color: color,
        variante: varianteExacta
      });
    }
  }

  calcularTalla() {
    if (!this.altura || !this.peso) return;

    this.calculandoTalla.set(true);

    this.#http.post<any>(`${environment.apiUrl}/calcular-talla`, {
      altura: this.altura,
      peso: this.peso,
      preferencia: 'normal'
    }).subscribe({
      next: (res: any) => {
        this.tallaRecomendada.set(res.talla || res);
        this.calculandoTalla.set(false);
      },
      error: () => {
        this.calculandoTalla.set(false);
      }
    });
  }
}