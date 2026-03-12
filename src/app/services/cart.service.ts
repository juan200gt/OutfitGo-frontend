import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, delay } from 'rxjs';
import { CartItem, CartResponse } from '../interfaces/cart.interface';
import { MOCK_CART, MOCK_PRODUCTS } from '../mocks/mock-data';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    #http = inject(HttpClient);
    #apiUrl = '/api/cart';

    cartItems = signal<CartItem[]>([]);
    private mockCartState = [...MOCK_CART];

    cartTotal = computed(() => {
        return this.cartItems().reduce((total, item) => total + Number(item.subtotal), 0);
    });

    totalItemsCount = computed(() => {
        return this.cartItems().reduce((count, item) => count + item.cantidad, 0);
    });

    loadCart(): void {
        this.#http.get<CartResponse>(this.#apiUrl).subscribe({
            next: (response) => {
                this.cartItems.set(response.data);
            },
            error: (err) => console.error(err)
        });
    }

    addToCart(producto_id: number, cantidad: number): Observable<any> {
        return this.#http.post(this.#apiUrl, { producto_id, cantidad }).pipe(
            tap(() => this.loadCart())
        );
    }

    removeItem(id: number): Observable<any> {
        return this.#http.delete(`${this.#apiUrl}/${id}`).pipe(
            tap(() => this.loadCart())
        );
    }
    checkout(data: any): Observable<any> {
        return this.#http.post(`${this.#apiUrl.replace('/cart', '/checkout')}`, data).pipe(
            tap(() => this.cartItems.set([]))
        );
    }
}
