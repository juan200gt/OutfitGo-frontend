import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './products-page.component.html',
})
export class ProductsPageComponent {
  #productService = inject(ProductService);
  cartService = inject(CartService);

  products = toSignal(this.#productService.getProducts(), { initialValue: [] as Product[] });

  handleAddToCart(product: Product) {
    this.cartService.addToCart(product.id, 1).subscribe();
    console.log('Añadido al carrito con éxito:', product.name);
  }
}
