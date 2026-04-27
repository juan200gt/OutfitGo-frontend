import { Component, input, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './product-reviews.component.html'
})
export class ProductReviewsComponent {
  #authService = inject(AuthService);
  #productService = inject(ProductService);

  productId = input.required<number>();
  reviews = signal<any[]>([]);
  reviewsInput = input<any[]>([]);

  // Sincronizar la señal interna con el input inicial
  constructor() {
    import('@angular/core').then(m => {
        m.effect(() => {
            this.reviews.set(this.reviewsInput());
        }, { allowSignalWrites: true });
    });
  }

  isLoggedIn = computed(() => this.#authService.currentUser() !== null);
  
  newRating = signal<number>(5);
  newComment = signal<string>('');
  isSubmitting = signal<boolean>(false);
  successMessage = signal<boolean>(false);

  getRatingStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  submitReview() {
    if (this.newComment().trim() === '' || this.isSubmitting()) return;
    
    this.isSubmitting.set(true);

    this.#productService.submitReview(this.productId(), this.newRating(), this.newComment()).subscribe({
        next: (response) => {
            // Añadimos la nueva reseña a la lista
            this.reviews.update(prev => [response.resena, ...prev]);
            
            this.newComment.set('');
            this.newRating.set(5);
            this.isSubmitting.set(false);
            this.successMessage.set(true); 
            setTimeout(() => this.successMessage.set(false), 5000);
        },
        error: (err) => {
            console.error(err);
            this.isSubmitting.set(false);
            alert('Hubo un error al enviar tu reseña.');
        }
    });
  }
}
