import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, delay } from 'rxjs';
import { CartItem, CartResponse } from '../interfaces/cart.interface';
import { MOCK_CART } from '../mocks/mock-data';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    #http = inject(HttpClient);
    #apiUrl = 'http://35.172.39.217:8000/api/cart';

    cartItems = signal<CartItem[]>([]);
    private mockCartState = [...MOCK_CART];

    cartTotal = computed(() => {
        return this.cartItems().reduce((total, item) => total + Number(item.subtotal), 0);
    });

    totalItemsCount = computed(() => {
        return this.cartItems().reduce((count, item) => count + item.cantidad, 0);
    });

    loadCart(): void {
        // TODO: Descomentar cuando la API vuelva
        /* this.#http.get<CartResponse>(this.#apiUrl).subscribe({
            next: (response) => {
                this.cartItems.set(response.data);
            },
            error: (err) => console.error(err)
        }); */

        of({ data: this.mockCartState }).pipe(delay(300)).subscribe({
            next: (response) => {
                this.cartItems.set(response.data);
            },
            error: (err) => console.error(err)
        });
    }

    addToCart(producto_id: number, cantidad: number): Observable<any> {
        // TODO: Descomentar cuando la API vuelva
        /* return this.#http.post(this.#apiUrl, { producto_id, cantidad }).pipe(
            tap(() => this.loadCart())
        ); */

        const newItem: CartItem = {
            id: Date.now(),
            cantidad,
            subtotal: cantidad * 19.99,
            producto: { id: producto_id, nombre: 'Producto Mock (Añadido)', slug: 'producto-mock', precio: '19.99', url_imagen_principal: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', stock: 10 },
            creado_en: new Date().toISOString(),
            actualizado_en: new Date().toISOString()
        };
        this.mockCartState.push(newItem);
        return of({ message: 'Añadido simulado' }).pipe(delay(300), tap(() => this.loadCart()));
    }

    removeItem(id: number): Observable<any> {
        // TODO: Descomentar cuando la API vuelva
        /* return this.#http.delete(`${this.#apiUrl}/${id}`).pipe(
            tap(() => this.loadCart())
        ); */

        this.mockCartState = this.mockCartState.filter(item => item.id !== id);
        return of({ message: 'Eliminado simulado' }).pipe(delay(300), tap(() => this.loadCart()));
    }
}
