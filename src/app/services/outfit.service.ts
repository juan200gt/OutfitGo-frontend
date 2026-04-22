import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { OutfitResponse } from '../interfaces/outfit.interface';
import { ProductService } from './product.service';
import { BackendProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class OutfitService {
  #http = inject(HttpClient);
  #productService = inject(ProductService);
  #apiUrl = environment.apiUrl; 

  generarOutfit(prompt: string): Observable<OutfitResponse> {
    return this.#http.post<OutfitResponse>(`${this.#apiUrl}/outfit-wizard`, { user_prompt: prompt }).pipe(
      map(res => {
        if (res && res.productos) {
          res.productos = res.productos.map(p => this.#productService.mapToProduct(p as unknown as BackendProduct));
        }
        return res;
      })
    );
  }
}