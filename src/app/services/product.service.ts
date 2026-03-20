import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, delay } from 'rxjs';
import { Product, BackendProduct, PaginatedResponse } from '../interfaces/product.interface';
import { MOCK_PRODUCTS } from '../mocks/mock-data';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    #http = inject(HttpClient);
    #apiUrl = environment.apiUrl + '/api/productos';

    getProducts(): Observable<Product[]> {
        return this.#http.get<PaginatedResponse>(this.#apiUrl).pipe(
            map(response => response.data.map(apiProduct => this.mapToProduct(apiProduct)))
        );
    }

    private mapToProduct(apiItem: BackendProduct): Product {
        let mappedCategory: 'man' | 'woman' | 'kids' = 'man';
        if (apiItem.publico === 'infantil') {
            mappedCategory = 'kids';
        } else if (apiItem.publico === 'hombre') {
            mappedCategory = 'man';
        } else if (apiItem.publico === 'mujer') {
            mappedCategory = 'woman';
        }

        return {
            id: apiItem.id,
            name: apiItem.nombre,
            price: parseFloat(apiItem.precio),
            image: apiItem.url_imagen_principal,
            category: mappedCategory,
            size: apiItem.tallas ? apiItem.tallas.map(t => t.nombre) : [],
            color: apiItem.colores && apiItem.colores.length > 0 ? apiItem.colores[0].nombre : 'Genérico',
            brand: apiItem.marca?.nombre || 'OutfitGo'
        };
    }
}
