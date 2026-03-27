import { Component, input, output, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../interfaces/product.interface';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  product = input.required<Product>();
  addToCart = output<Product>();

  favoriteService = inject(FavoriteService);

  // Alterna el estado de favorito para este producto
  toggleFavorite(event: Event) {
    event.stopPropagation(); // Evitamos que el click afecte a otros elementos (como el link al detalle)
    this.favoriteService.toggleFavorite(this.product().id).subscribe();
  }
}
