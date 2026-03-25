import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  #http = inject(HttpClient);
  #authService = inject(AuthService);
  #platformId = inject(PLATFORM_ID);
  #apiUrl = environment.apiUrl;

  // Señal para almacenar la lista de favoritos de forma reactiva
  // Guardamos los objetos completos que devuelve el backend (incluyen el producto_id)
  favorites = signal<any[]>([]);

  constructor() {
    // Intentamos cargar favoritos al iniciar el servicio si ya hay sesión
    if (isPlatformBrowser(this.#platformId)) {
        if (this.#authService.currentUser()) {
            this.loadFavorites();
        }
    }
  }

  // Carga la lista inicial desde el servidor
  loadFavorites() {
    if (!this.#authService.currentUser()) {
        this.favorites.set([]);
        return;
    }

    this.#http.get<any[]>(`${this.#apiUrl}/favorites`).subscribe({
      next: (data) => this.favorites.set(data),
      error: (err) => {
        console.error('Error al cargar favoritos', err);
        this.favorites.set([]);
      }
    });
  }

  // Añade un producto a favoritos
  addFavorite(productId: number) {
    // Si no hay sesión, no hacemos nada (la UI debería manejar la redirección)
    if (!this.#authService.currentUser()) return of(null);

    return this.#http.post(`${this.#apiUrl}/favorites`, { producto_id: productId }).pipe(
      tap(() => this.loadFavorites()), // Recargamos para mantener la lista fresca
      catchError(err => {
        console.error('Error al añadir a favoritos', err);
        return of(null);
      })
    );
  }

  // Elimina un producto de favoritos (usando el ID del producto)
  removeFavorite(productId: number) {
    if (!this.#authService.currentUser()) return of(null);

    return this.#http.delete(`${this.#apiUrl}/favorites/${productId}`).pipe(
      tap(() => this.loadFavorites()),
      catchError(err => {
        console.error('Error al eliminar de favoritos', err);
        return of(null);
      })
    );
  }

  // Comprueba si un producto específico está en la lista (útil para el icono del corazón)
  isFavorite(productId: number): boolean {
    return this.favorites().some(f => f.producto_id === productId);
  }

  // Alterna el estado de favorito
  toggleFavorite(productId: number) {
    if (this.isFavorite(productId)) {
        return this.removeFavorite(productId);
    } else {
        return this.addFavorite(productId);
    }
  }
}
