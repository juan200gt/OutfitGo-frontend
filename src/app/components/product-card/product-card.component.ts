import { Component, input, output, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Product } from '../../interfaces/product.interface';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, TranslateModule],
  template: `
    <div class="card bg-base-100 shadow-xl group overflow-hidden border border-base-200 hover:shadow-2xl transition-all duration-300">
        <figure class="cursor-pointer relative" [routerLink]="['/producto', product().slug]">
            <img [src]="product().image" [alt]="product().nombre_localizado || product().name" 
                class="object-cover h-64 w-full transition-transform duration-500 group-hover:scale-110" />
            
            <!-- Botón Favorito -->
            <button 
                (click)="toggleFavorite($event)" 
                class="absolute top-3 right-3 z-20 btn btn-circle btn-sm bg-base-100/80 backdrop-blur-md border-none shadow-md"
                [class.text-red-500]="favoriteService.isFavorite(product().id)"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" [attr.fill]="favoriteService.isFavorite(product().id) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
        </figure>
        
        <div class="card-body p-5">
            <h2 class="card-title text-base font-bold line-clamp-1">
                {{ product().nombre_localizado || product().name }}
            </h2>
            
            <div class="flex items-end justify-between mt-2">
                <span class="text-2xl font-black text-primary">{{ product().price | currency:'EUR' }}</span>
                @if (product().brand) {
                    <span class="badge badge-ghost badge-sm opacity-60 font-medium">{{ product().brand }}</span>
                }
            </div>

            <div class="card-actions mt-6 grid grid-cols-2 gap-2">
                <button class="btn btn-primary btn-sm font-bold shadow-lg shadow-primary/20" (click)="addToCart.emit(product())">
                    {{ 'PRODUCT_DETAIL.ADD_TO_CART' | translate }}
                </button>
                <a [routerLink]="['/producto', product().slug]" class="btn btn-ghost btn-outline btn-sm font-bold">
                    {{ 'COMMON.VIEW_DETAILS' | translate }}
                </a>
            </div>
        </div>
    </div>
  `
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
