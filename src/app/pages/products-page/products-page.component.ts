import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './products-page.component.html',
})
export class ProductsPageComponent {
  #productService = inject(ProductService);

  products = toSignal(this.#productService.getProducts(), { initialValue: [] as Product[] });

  handleProductAction(product: Product) {
    console.log('Action dispatched for product:', product.name);
  }
}
