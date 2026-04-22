import { Component, inject, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap, map } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ProductCardComponent, TranslateModule],
  templateUrl: './products-page.component.html',
})
export class ProductsPageComponent {
  #productService = inject(ProductService);
  #translate = inject(TranslateService);
  cartService = inject(CartService);
  route = inject(ActivatedRoute);

  filters = signal({ publico: '', talla: '', color: '', marca_id: '', categoria_id: '' });

  availableCategories = signal<{ id: number, nombre: string, nombre_localizado?: string }[]>([]);
  availableBrands = signal<{ id: number, nombre: string }[]>([]);
  availableColors = signal<{ id: number, nombre: string }[]>([]);
  availableSizes = signal<{ id: number, nombre: string }[]>([]);

  // Título de la página reactivo según la categoría elegida
  pageTitle = signal('PRODUCTS.TITLE_ALL');

  constructor() {
    this.route.url.subscribe(segments => {
      const path = segments.map(segment => segment.path).join('/');
      let publico = '';
      let titleKey = 'PRODUCTS.TITLE_ALL';

      if (path.includes('women')) {
        publico = 'mujer';
        titleKey = 'PRODUCTS.TITLE_WOMEN';
      } else if (path.includes('men')) {
        publico = 'hombre';
        titleKey = 'PRODUCTS.TITLE_MEN';
      } else if (path.includes('kids')) {
        publico = 'infantil';
        titleKey = 'PRODUCTS.TITLE_KIDS';
      }

      this.filters.update(f => ({ ...f, publico }));
      this.pageTitle.set(titleKey);
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
    const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
    const defaultSize = defaultVariant ? defaultVariant.size : 'Única';
    const defaultColor = defaultVariant ? defaultVariant.color : 'Único';

    this.cartService.addToCart(product, 1, defaultSize, defaultColor, defaultVariant).subscribe();
  }
}