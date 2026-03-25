import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { CartItem, CartResponse } from '../interfaces/cart.interface';
import { Product } from '../interfaces/product.interface';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    #http = inject(HttpClient);
    #authService = inject(AuthService);

    #apiUrl = environment.apiUrl + '/cart';

    cartItems = signal<CartItem[]>([]);

    cartTotal = computed(() => {
        return this.cartItems().reduce((total, item) => total + Number(item.subtotal), 0);
    });

    totalItemsCount = computed(() => {
        return this.cartItems().reduce((count, item) => count + item.cantidad, 0);
    });

    private isLoggedIn(): boolean {
        return !!localStorage.getItem('access_token');
    }

    loadCart(): void {
        if (this.isLoggedIn()) {
            this.#http.get<CartResponse>(this.#apiUrl).subscribe({
                next: (response) => this.cartItems.set(response.data),
                error: (err) => console.error('Error cargando carrito de API', err)
            });
        } else {
            const guestCart = localStorage.getItem('guest_cart');
            if (guestCart) {
                this.cartItems.set(JSON.parse(guestCart));
            } else {
                this.cartItems.set([]);
            }
        }
    }

    addToCart(producto: Product, cantidad: number): Observable<any> {
        if (this.isLoggedIn()) {
            return this.#http.post(this.#apiUrl, { producto_id: producto.id, cantidad }).pipe(
                tap(() => this.loadCart())
            );
        } else {
            const currentItems = [...this.cartItems()];
            const existingItemIndex = currentItems.findIndex(item => item.producto.id === producto.id);

            if (existingItemIndex !== -1) {
                currentItems[existingItemIndex].cantidad += cantidad;
                currentItems[existingItemIndex].subtotal = currentItems[existingItemIndex].cantidad * producto.price;
            } else {
                const newItem: CartItem = {
                    id: Date.now(),
                    cantidad: cantidad,
                    subtotal: cantidad * producto.price,
                    creado_en: new Date().toISOString(),      // <-- Añadido para TypeScript
                    actualizado_en: new Date().toISOString(), // <-- Añadido para TypeScript
                    producto: {
                        id: producto.id,
                        nombre: producto.name,
                        precio: producto.price.toString(),
                        url_imagen_principal: producto.image,
                    } as any
                };
                currentItems.push(newItem);
            }

            this.cartItems.set(currentItems);
            localStorage.setItem('guest_cart', JSON.stringify(currentItems));
            return of(currentItems);
        }
    }

    removeItem(id: number): Observable<any> {
        if (this.isLoggedIn()) {
            return this.#http.delete(`${this.#apiUrl}/${id}`).pipe(
                tap(() => this.loadCart())
            );
        } else {
            const currentItems = this.cartItems().filter(item => item.id !== id);
            this.cartItems.set(currentItems);
            localStorage.setItem('guest_cart', JSON.stringify(currentItems));
            return of(currentItems);
        }
    }

    updateQuantity(id: number, cantidad: number): Observable<any> {
        if (this.isLoggedIn()) {
            return this.#http.patch(`${this.#apiUrl}/${id}`, { cantidad }).pipe(
                tap(() => this.loadCart())
            );
        } else {
            const currentItems = [...this.cartItems()];
            const itemIndex = currentItems.findIndex(item => item.id === id);

            if (itemIndex !== -1) {
                const item = currentItems[itemIndex];
                item.cantidad = cantidad;
                const precio = Number(item.producto.precio);
                item.subtotal = cantidad * (isNaN(precio) ? 0 : precio);
                
                this.cartItems.set(currentItems);
                localStorage.setItem('guest_cart', JSON.stringify(currentItems));
            }
            return of(currentItems);
        }
    }

    checkout(data: any): Observable<any> {
        return this.#http.post(`${environment.apiUrl}/checkout/iniciar`, data).pipe(
            tap(() => {
                this.cartItems.set([]);
                localStorage.removeItem('guest_cart');
            })
        );
    }

    syncGuestCartToApi(): void {
        const guestCart = localStorage.getItem('guest_cart');
        if (guestCart && this.isLoggedIn()) {
            const items: CartItem[] = JSON.parse(guestCart);
            items.forEach(item => {
                this.#http.post(this.#apiUrl, { producto_id: item.producto.id, cantidad: item.cantidad }).subscribe();
            });
            localStorage.removeItem('guest_cart');
            setTimeout(() => this.loadCart(), 1000);
        }
    }
}