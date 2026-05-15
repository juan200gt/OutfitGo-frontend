import { Component, input, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Product } from '../../interfaces/product.interface';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, TranslateModule],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  product = input.required<Product>();

  favoriteService = inject(FavoriteService);

  toggleFavorite(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.favoriteService.toggleFavorite(this.product().id).subscribe();
  }
}