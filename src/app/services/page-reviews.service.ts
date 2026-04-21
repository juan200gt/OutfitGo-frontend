import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { PageReview } from '../interfaces/page-review.interface';

@Injectable({
    providedIn: 'root'
})
export class PageReviewsService {
    #http = inject(HttpClient);
    #apiUrl = `${environment.apiUrl}/resenas-pagina`;

    getPageReviews(): Observable<PageReview[]> {
        return this.#http.get<PageReview[]>(this.#apiUrl);
    }

    submitReview(rating: number, comment: string): Observable<any> {
    return this.#http.post(`${this.#apiUrl}`, {
      puntuacion: rating,
      comentario: comment
    });
  }
}
