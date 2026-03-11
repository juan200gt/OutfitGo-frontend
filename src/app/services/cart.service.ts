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

        const existingItem = this.mockCartState.find(item => item.producto.id === producto_id);
        let returnItem: CartItem;

        if (existingItem) {
            existingItem.cantidad += cantidad;
            existingItem.subtotal = existingItem.cantidad * Number(existingItem.producto.precio);
            returnItem = existingItem;
        } else {
            const product = MOCK_PRODUCTS.find(p => p.id === producto_id);
            if (!product) return of({ message: 'Producto no encontrado' }).pipe(delay(300));

            returnItem = {
                id: Date.now(),
                cantidad,
                subtotal: cantidad * product.price,
                producto: { id: product.id, nombre: product.name, slug: `p-${product.id}`, precio: product.price.toString(), url_imagen_principal: product.image, stock: 10 },
                creado_en: new Date().toISOString(),
                actualizado_en: new Date().toISOString()
            };
            this.mockCartState.push(returnItem);
        }

        this.cartItems.set([...this.mockCartState]);
        return of(returnItem).pipe(delay(300));
    }

    removeItem(id: number): Observable<any> {
        // TODO: Descomentar cuando la API vuelva
        /* return this.#http.delete(`${this.#apiUrl}/${id}`).pipe(
            tap(() => this.loadCart())
        ); */

        this.mockCartState = this.mockCartState.filter(item => item.id !== id);
        return of({ message: 'Eliminado simulado' }).pipe(delay(300), tap(() => this.loadCart()));
    }
    checkout(): Observable<any> {
        // TODO: Descomentar cuando la API vuelva
        /* return this.#http.post(`${this.#apiUrl.replace('/cart', '/checkout')}`, {}).pipe(
            tap(() => this.loadCart())
        ); */

        return of({ message: 'Compra realizada con éxito' }).pipe(
            delay(800),
            tap(() => {
                this.mockCartState = [];
                this.cartItems.set([]);
            })
        );
    }
}
