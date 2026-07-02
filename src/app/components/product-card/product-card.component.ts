import { Component, input, inject, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../interfaces/product.interface';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  product = input.required<Product>();
  addToCart = output<Product>();

  favoriteService = inject(FavoriteService);

  toggleFavorite(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.favoriteService.toggleFavorite(this.product().id).subscribe();
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img.src.includes('no-image.png') || img.src.includes('data:image')) {
      img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23ccc"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%23666">No Image</text></svg>';
      return;
    }
    img.src = '/OutfitGo-frontend/no-image.png';
  }

  getCategoryLabel(category: string): string {
    const lower = category.toLowerCase();
    if (lower === 'man' || lower === 'men' || lower === 'hombre') return 'Hombre';
    if (lower === 'woman' || lower === 'women' || lower === 'mujer') return 'Mujer';
    if (lower === 'kids' || lower === 'infantil') return 'Infantil';
    return category;
  }
}
