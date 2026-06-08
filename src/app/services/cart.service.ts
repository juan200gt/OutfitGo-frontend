import { Injectable, inject, signal, computed, effect } from '@angular/core';
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

    appliedCoupon = signal<any | null>(null);

    cartTotal = computed(() => {
        let total = this.cartItems().reduce((t, item) => t + Number(item.subtotal), 0);
        const coupon = this.appliedCoupon();
        
        if (coupon) {
            if (coupon.tipo === 'porcentaje') {
                total = total - (total * (coupon.valor / 100));
            } else if (coupon.tipo === 'fijo') {
                total = total - coupon.valor;
            }
        }
        return total > 0 ? total : 0; 
    });
    
    totalItemsCount = computed(() => {
        return this.cartItems().reduce((count, item) => count + item.cantidad, 0);
    });

    constructor() {
        effect(() => {
            const user = this.#authService.currentUser();
            if (user) {
                this.syncGuestCartToApi();
            } else {
                this.loadCart();
            }
        });
    }

    private isLoggedIn(): boolean {
        return !!localStorage.getItem('auth_token') || !!sessionStorage.getItem('auth_token');
    }

    validateCoupon(code: string): Observable<any> {
        return this.#http.post(`${environment.apiUrl}/cupon/validar`, { codigo: code }).pipe(
            tap((res: any) => {
                this.appliedCoupon.set(res.cupon);
            })
        );
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

    addToCart(product: Product, quantity: number, size: string, color: string, variante?: any): Observable<any> {
        if (this.isLoggedIn()) {
            return this.#http.post(this.#apiUrl, { 
                producto_id: product.id, 
                cantidad: quantity,
                talla: size,
                color: color 
            }).pipe(
                tap(() => this.loadCart())
            );
        } else {
            const currentItems = [...this.cartItems()];
            
            const existingItemIndex = currentItems.findIndex(item => 
                item.variante?.producto?.id === product.id && 
                item.variante?.talla?.nombre === size && 
                item.variante?.color?.nombre === color
            );

            if (existingItemIndex !== -1) {
                currentItems[existingItemIndex].cantidad += quantity;
                currentItems[existingItemIndex].subtotal = currentItems[existingItemIndex].cantidad * product.price;
            } else {
                const newItem: CartItem = {
                    id: Date.now(),
                    cantidad: quantity,
                    subtotal: quantity * product.price,
                    creado_en: new Date().toISOString(),
                    actualizado_en: new Date().toISOString(),
                    variante: {
                        id: variante ? variante.id : 0, 
                        stock: product.stock,
                        talla: { nombre: size },
                        color: { nombre: color },
                        producto: {
                            id: product.id,
                            nombre: product.name,
                            slug: product.slug,
                            precio: product.price.toString(),
                            url_imagen_principal: product.image,
                        }
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
                const precio = Number(item.variante.producto.precio);
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
            try {
                const items: CartItem[] = JSON.parse(guestCart);
                if (items.length === 0) {
                    localStorage.removeItem('guest_cart');
                    this.loadCart();
                    return;
                }
                const payload = items.map(item => ({
                    producto_id: item.variante.producto.id,
                    cantidad: item.cantidad,
                    talla: item.variante.talla.nombre,
                    color: item.variante.color.nombre
                }));

                this.#http.post<CartResponse>(`${this.#apiUrl}/sync`, { items: payload }).subscribe({
                    next: (res) => {
                        this.cartItems.set(res.data);
                        localStorage.removeItem('guest_cart');
                    },
                    error: (err) => {
                        console.error('Error syncing guest cart to api', err);
                        this.loadCart();
                    }
                });
            } catch (e) {
                console.error('Failed to parse guest cart storage', e);
                localStorage.removeItem('guest_cart');
                this.loadCart();
            }
        }
    }
}