import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ProductDetailInfoComponent } from '../../components/product-detail-info/product-detail-info.component';
import { ProductReviewsComponent } from '../../components/product-reviews/product-reviews.component';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [ProductDetailInfoComponent, ProductReviewsComponent],
  templateUrl: './product-detail-page.component.html'
})
export class ProductDetailPageComponent {
  route = inject(ActivatedRoute);
  #productService = inject(ProductService);
  cartService = inject(CartService);

  product = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const slug = params.get('slug');
        return this.#productService.getProductBySlug(slug!);
      })
    )
  );

  handleAddToCart(event: { product: any, quantity: number, size: string, color: string, variante?: any }) {
    this.cartService.addToCart(event.product, event.quantity, event.size, event.color, event.variante).subscribe();
    console.log(`Añadido: ${event.quantity}x ${event.product.name} (Talla: ${event.size}, Color: ${event.color})`);
  }
}