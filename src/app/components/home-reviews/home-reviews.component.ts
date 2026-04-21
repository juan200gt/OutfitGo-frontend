import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { Component, OnInit, inject } from '@angular/core';
import { PageReview } from '../../interfaces/page-review.interface';
import { PageReviewsService } from '../../services/page-reviews.service';

@Component({
    selector: 'app-home-reviews',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './home-reviews.component.html'
})
export class HomeReviewsComponent implements OnInit {
    #pageReviewsService = inject(PageReviewsService);

    reviews: PageReview[] = [];

    ngOnInit(): void {
        this.#pageReviewsService.getPageReviews().subscribe({
            next: (reviews: PageReview[]) => {
                this.reviews = reviews;
            },
            error: (error: unknown) => {
                console.error('No se pudieron cargar las reseñas de portada.', error);
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
        next: () => {
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
