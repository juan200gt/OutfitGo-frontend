import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageReview } from '../../interfaces/page-review.interface';
import { PageReviewsService } from '../../services/page-reviews.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-home-reviews',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './home-reviews.component.html'
})
export class HomeReviewsComponent implements OnInit {
    #pageReviewsService = inject(PageReviewsService);
    #authService = inject(AuthService);

    isLoggedIn = computed(() => this.#authService.currentUser() !== null);

    reviews: PageReview[] = [];

    private fallbackReviews: PageReview[] = [
        {
            id: -1,
            comentario: '¡Excelente calidad de ropa y el envío fue súper rápido! Volveré a comprar sin duda.',
            puntuacion: 5,
            created_at: new Date().toISOString(),
            user: { id: -1, name: 'Sofía Rodríguez' }
        },
        {
            id: -2,
            comentario: 'Me encanta el recomendador de tallas por IA. Acertó por completo y la tela se siente de primera.',
            puntuacion: 5,
            created_at: new Date().toISOString(),
            user: { id: -2, name: 'Alejandro Gómez' }
        },
        {
            id: -3,
            comentario: 'Muy buen servicio al cliente y las prendas de abrigo son súper abrigadas y cómodas.',
            puntuacion: 4,
            created_at: new Date().toISOString(),
            user: { id: -3, name: 'Lucía Fernández' }
        }
    ];

    ngOnInit(): void {
        this.#pageReviewsService.getPageReviews().subscribe({
            next: (reviews: PageReview[]) => {
                this.reviews = reviews && reviews.length > 0 ? reviews : this.fallbackReviews;
            },
            error: (error: unknown) => {
                console.error('No se pudieron cargar las reseñas de portada, usando reseñas de fallback.', error);
                this.reviews = this.fallbackReviews;
            }
        });
    }

    getStars(rating: number): number[] {
        return Array.from({ length: rating }, (_, index) => index);
    }

    newRating = signal<number>(5);
    newComment = signal<string>('');
    isSubmitting = signal<boolean>(false);
    successMessage = signal<boolean>(false);

    submitReview() {
        if (this.newComment().trim() === '') return;
        
        this.isSubmitting.set(true);

        this.#pageReviewsService.submitReview(this.newRating(), this.newComment()).subscribe({
        next: (response: any) => {
            if (response && response.resena) {
                this.reviews.unshift(response.resena);
                
                if (this.reviews.length > 3) {
                    this.reviews.pop();
                }
            }
            this.newComment.set('');
            this.newRating.set(5);
            this.isSubmitting.set(false);
            this.successMessage.set(true); 

            setTimeout(() => this.successMessage.set(false), 5000);
        },
        error: (err) => {
            console.error(err);
            this.isSubmitting.set(false);
            alert('Hubo un error al enviar tu opinión.');
        }
        });
    }
}
