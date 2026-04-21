import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product, BackendProduct, PaginatedResponse } from '../interfaces/product.interface';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    #http = inject(HttpClient);
    #apiUrl = `${environment.apiUrl}/productos`; 

    getProducts(filters: any = {}): Observable<{ productos: Product[], filtros: any }> {
        let params = new HttpParams();
        
        if (filters.publico) params = params.set('publico', filters.publico);
        if (filters.talla) params = params.set('talla', filters.talla);
        if (filters.categoria_id) params = params.set('categoria_id', filters.categoria_id);
        if (filters.color) params = params.set('color', filters.color);
        if (filters.marca_id) params = params.set('marca_id', filters.marca_id);

        return this.#http.get<PaginatedResponse>(this.#apiUrl, { params }).pipe(
            map(response => ({
                productos: response.data.map(apiProduct => this.mapToProduct(apiProduct)),
                filtros: response.filtros_disponibles
            }))
        );
    }

    getHistorialPrecios(id: number): Observable<{labels: string[], precios: number[]}> {
        return this.#http.get<{labels: string[], precios: number[]}>(`${this.#apiUrl}/${id}/historial`);
    }

    getProductBySlug(slug: string): Observable<Product> {
        return this.#http.get<BackendProduct>(`${this.#apiUrl}/${slug}`).pipe(
            map(apiProduct => this.mapToProduct(apiProduct))
        );
    }

    public mapToProduct(apiItem: BackendProduct): Product {
        let mappedCategory: 'man' | 'woman' | 'kids' = 'man';
        if (apiItem.publico === 'infantil') mappedCategory = 'kids';
        else if (apiItem.publico === 'hombre') mappedCategory = 'man';
        else if (apiItem.publico === 'mujer') mappedCategory = 'woman';

        const extraImages = apiItem.imagenes ? apiItem.imagenes.map(img => img.url_imagen) : [];
        const fullGallery = [apiItem.url_imagen_principal, ...extraImages];

        return {
            id: apiItem.id,
            name: apiItem.nombre,
            slug: apiItem.slug,
            description: apiItem.descripcion,
            price: parseFloat(apiItem.precio),
            image: apiItem.url_imagen_principal,
            gallery: fullGallery,
            category: mappedCategory,
            size: apiItem.tallas ? apiItem.tallas.map(t => t.nombre) : [],
            colors: apiItem.colores || [],
            color: apiItem.colores && apiItem.colores.length > 0 ? apiItem.colores[0].nombre : 'Genérico',
            brand: apiItem.marca?.nombre || 'OutfitGo',
            stock: apiItem.stock || 0,
            variants: apiItem.variantes ? apiItem.variantes.map(v => ({
                size: v.talla.nombre,
                color: v.color.nombre,
                stock: v.stock
            })) : []
        };
    }
}