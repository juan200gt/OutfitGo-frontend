import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FavoriteService } from '../../services/favorite.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [ProductCardComponent, RouterLink],
  templateUrl: './favorites-page.component.html',
})
export class FavoritesPageComponent {
  private favoriteService = inject(FavoriteService);
  private cartService = inject(CartService);
  private productService = inject(ProductService);

  // Mapeamos los favoritos que vienen del backend al formato de la interfaz Product
  // El backend devuelve una lista de objetos Favorite, donde f.producto es el producto real
  favoriteProducts = computed(() => {
    return this.favoriteService.favorites().map(f => {
      // Usamos el mapeador centralizado del servicio para evitar inconsistencias de datos (como campos vacíos)
      return this.productService.mapToProduct(f.producto);
    });
  });

  // Manejamos la adición al carrito desde la lista de favoritos
  handleAddToCart(product: Product) {
    this.cartService.addToCart(product, 1).subscribe();
  }
}
