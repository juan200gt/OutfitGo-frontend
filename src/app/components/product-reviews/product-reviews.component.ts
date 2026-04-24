import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './product-reviews.component.html'
})
export class ProductReviewsComponent {
  reviews = input<any[]>([]);

  getRatingStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }
}
