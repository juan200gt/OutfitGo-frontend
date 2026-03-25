import { Component, inject, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap, map } from 'rxjs';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './products-page.component.html',
})
export class ProductsPageComponent {
  #productService = inject(ProductService);
  cartService = inject(CartService);
  route = inject(ActivatedRoute);

  filters = signal({ publico: '', talla: '', color: '', marca_id: '', categoria_id: '' });

  availableCategories = signal<{id: number, nombre: string}[]>([]);
  availableBrands = signal<{id: number, nombre: string}[]>([]);
  availableColors = signal<{id: number, nombre: string}[]>([]);
  availableSizes = signal<{id: number, nombre: string}[]>([]);

  constructor() {
    this.route.url.subscribe(segments => {
      const path = segments.map(segment => segment.path).join('/');
      let publico = '';
      if (path.includes('women')) publico = 'mujer';
      else if (path.includes('men')) publico = 'hombre';
      else if (path.includes('kids')) publico = 'infantil';
      
      this.filters.update(f => ({ ...f, publico }));
    });
  }

  products = toSignal(
    toObservable(this.filters).pipe(
      switchMap(currentFilters => this.#productService.getProducts(currentFilters)),
      tap(response => {
          if (response.filtros) {
              this.availableCategories.set(response.filtros.categorias);
              this.availableBrands.set(response.filtros.marcas);
              this.availableColors.set(response.filtros.colores);
              this.availableSizes.set(response.filtros.tallas);
          }
      }),
      map(response => response.productos)
    ),
    { initialValue: [] as Product[] }
  );

  updateFilter(key: 'talla' | 'color' | 'marca_id' | 'categoria_id', event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filters.update(f => ({ ...f, [key]: value }));
  }

  handleAddToCart(product: Product) {
    this.cartService.addToCart(product, 1).subscribe();
  }
}