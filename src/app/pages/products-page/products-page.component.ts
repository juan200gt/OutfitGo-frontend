import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './products-page.component.html',
})
export class ProductsPageComponent implements OnInit {
  #productService = inject(ProductService);

  products = signal<Product[]>([]);

  ngOnInit() {
    this.products.set(this.#productService.products());
  }

  handleProductAction(product: Product) {
    console.log('Action dispatched for product:', product.name);
  }
}
