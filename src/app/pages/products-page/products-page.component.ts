import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../interfaces/product.interface';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

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

  products = toSignal(
    this.#productService.getProducts().pipe(
      map(allProducts => {
        const path = this.route.snapshot.url.map(segment => segment.path).join('/');
        if (path.includes('women')) return allProducts.filter(p => p.category === 'woman');
        if (path.includes('men')) return allProducts.filter(p => p.category === 'man');
        if (path.includes('kids')) return allProducts.filter(p => p.category === 'kids');
        return allProducts; // 'all' or default
      })
    ),
    { initialValue: [] as Product[] }
  );

  handleAddToCart(product: Product) {
    this.cartService.addToCart(product, 1).subscribe();
    console.log('Añadido al carrito con éxito:', product.name);
  }
}
