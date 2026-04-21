import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OutfitResponse } from '../interfaces/outfit.interface';

@Injectable({
  providedIn: 'root'
})
export class OutfitService {
  #http = inject(HttpClient);
  #apiUrl = environment.apiUrl; 

  generarOutfit(prompt: string): Observable<OutfitResponse> {
    return this.#http.post<OutfitResponse>(`${this.#apiUrl}/outfit-wizard`, { user_prompt: prompt });
  }
}