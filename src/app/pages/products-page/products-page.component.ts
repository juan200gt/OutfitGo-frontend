import { Component, inject, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap, map, catchError, delay, of } from 'rxjs';

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

  filters = signal({ publico: '', talla: '', color: '', marca_id: '', categoria_id: '' , page: 1});

  availableCategories = signal<{ id: number, nombre: string, nombre_localizado?: string }[]>([]);
  availableBrands = signal<{ id: number, nombre: string }[]>([]);
  availableColors = signal<{ id: number, nombre: string }[]>([]);
  availableSizes = signal<{ id: number, nombre: string }[]>([]);

  pageTitle = signal('Nuestra Colección');

  currentPage = signal<number>(1);
  lastPage = signal<number>(1);

  isLoading = signal<boolean>(true);

  constructor() {
    this.route.url.subscribe(segments => {
      const path = segments.map(segment => segment.path).join('/');
      let publico = '';
      let titleKey = 'Nuestra Colección';

      if (path.includes('women')) {
        publico = 'mujer';
        titleKey = 'Ropa para Mujer';
      } else if (path.includes('men')) {
        publico = 'hombre';
        titleKey = 'Ropa para Hombre';
      } else if (path.includes('kids')) {
        publico = 'infantil';
        titleKey = 'Ropa Infantil';
      }

      this.filters.update(f => ({ ...f, publico , page: 1}));
      this.pageTitle.set(titleKey);
    });
  }

  products = toSignal(
    toObservable(this.filters).pipe(
      tap(() => this.isLoading.set(true)), 
      
      switchMap(currentFilters => this.#productService.getProducts(currentFilters).pipe(
        delay(500), 
        catchError((err) => {
            console.error('Error del backend:', err);
            return of({ productos: [], filtros: null, current_page: 1, total: 0 }); 
        })
      )),
      
      tap(response => {
        if (response.filtros) {
          this.availableCategories.set(response.filtros.categorias);
          this.availableBrands.set(response.filtros.marcas);
          this.availableColors.set(response.filtros.colores);
          this.availableSizes.set(response.filtros.tallas);
        }
        
        this.currentPage.set(response.current_page || 1);
        const totalItems = response.total || 0;
        this.lastPage.set(Math.ceil(totalItems / 12) || 1);

        this.isLoading.set(false); 
      }),
      map(response => response.productos)
    ),
    { initialValue: [] as Product[] }
  );

  updateFilter(key: 'talla' | 'color' | 'marca_id' | 'categoria_id', event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filters.update(f => ({ ...f, [key]: value, page: 1 }));
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.lastPage()) {
      this.filters.update(f => ({ ...f, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  handleAddToCart(product: Product) {
    const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
    const defaultSize = defaultVariant ? defaultVariant.size : 'Única';
    const defaultColor = defaultVariant ? defaultVariant.color : 'Único';

    this.cartService.addToCart(product, 1, defaultSize, defaultColor, defaultVariant).subscribe();
  }
}
