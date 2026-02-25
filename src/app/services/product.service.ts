import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    /**
     * Estado global de los productos utilizando Signals.
     * Almacenamos el listado completo para ser consumido
     * por los Smart Components.
     */
    #products = signal<Product[]>([
        {
            id: 1,
            name: 'Camiseta Nike Sportswear Club',
            price: 19.99,
            image: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=500&q=80',
            category: 'kids',
            size: ['XS', 'S', 'M'],
            color: 'Negro',
            brand: 'Nike'
        },
        {
            id: 2,
            name: 'Pantalón Chándal Adidas 3-Stripes',
            price: 34.50,
            image: 'https://images.unsplash.com/photo-1511196020521-122e1b6cb64b?w=500&q=80',
            category: 'kids',
            size: ['M', 'L', 'XL'],
            color: 'Azul Marino',
            brand: 'Adidas'
        },
        {
            id: 3,
            name: 'Sudadera Puma Essentials',
            price: 28.00,
            image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=500&q=80',
            category: 'kids',
            size: ['S', 'M', 'L'],
            color: 'Gris',
            brand: 'Puma'
        },
        {
            id: 4,
            name: 'Chaqueta Cortavientos Nike Team',
            price: 45.00,
            image: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=500&q=80',
            category: 'kids',
            size: ['M', 'L', 'XL'],
            color: 'Rojo',
            brand: 'Nike'
        },
        {
            id: 5,
            name: 'Vestido Floral Zara Summer',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80',
            category: 'woman',
            size: ['XS', 'S', 'M'],
            color: 'Multicolor',
            brand: 'Zara'
        },
        {
            id: 6,
            name: 'Blusa Seda H&M Premium',
            price: 29.99,
            image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500&q=80',
            category: 'woman',
            size: ['S', 'M', 'L'],
            color: 'Blanco',
            brand: 'H&M'
        },
        {
            id: 7,
            name: 'Leggings Adidas Running',
            price: 45.00,
            image: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=500&q=80',
            category: 'woman',
            size: ['XS', 'S', 'M', 'L'],
            color: 'Negro',
            brand: 'Adidas'
        },
        {
            id: 8,
            name: 'Chaqueta Vaquera Levi\'s Original',
            price: 89.90,
            image: 'https://images.unsplash.com/photo-1527219525722-f9767a7f2884?w=500&q=80',
            category: 'woman',
            size: ['S', 'M', 'L'],
            color: 'Azul Claro',
            brand: 'Levi\'s'
        },
        {
            id: 9,
            name: 'Camisa Oxford Ralph Lauren',
            price: 75.00,
            image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80',
            category: 'men',
            size: ['M', 'L', 'XL'],
            color: 'Blanco',
            brand: 'Ralph Lauren'
        },
        {
            id: 10,
            name: 'Vaqueros Levi\'s 501 Original',
            price: 99.00,
            image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500&q=80',
            category: 'men',
            size: ['30', '32', '34', '36'],
            color: 'Azul Denim',
            brand: 'Levi\'s'
        },
        {
            id: 11,
            name: 'Chaqueta North Face Resolve',
            price: 110.00,
            image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500&q=80',
            category: 'men',
            size: ['M', 'L', 'XL'],
            color: 'Negro',
            brand: 'The North Face'
        },
        {
            id: 12,
            name: 'Camiseta Gráfica Vans',
            price: 25.00,
            image: 'https://images.unsplash.com/photo-1503341338985-c0477be52513?w=500&q=80',
            category: 'men',
            size: ['S', 'M', 'L'],
            color: 'Negro',
            brand: 'Vans'
        },
        {
            id: 13,
            name: 'Zapatillas Converse Chuck Taylor',
            price: 65.00,
            image: 'https://images.unsplash.com/photo-1494496195158-c31bda6741cc?w=500&q=80',
            category: 'woman',
            size: ['36', '37', '38', '39', '40'],
            color: 'Negro',
            brand: 'Converse'
        },
        {
            id: 14,
            name: 'Gafas de Sol Aviator',
            price: 135.00,
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
            category: 'men',
            size: ['Única'],
            color: 'Dorado',
            brand: 'Ray-Ban'
        },
        {
            id: 15,
            name: 'Chubasquero Infantil Amarillo',
            price: 29.99,
            image: 'https://images.unsplash.com/photo-1629026363650-61848529cb67?w=500&q=80',
            category: 'kids',
            size: ['S', 'M', 'L'],
            color: 'Amarillo',
            brand: 'Petit Bateau'
        },
        {
            id: 16,
            name: 'Botas Timberland Premium',
            price: 145.00,
            image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b69f?w=500&q=80',
            category: 'men',
            size: ['40', '41', '42', '43', '44'],
            color: 'Mostaza',
            brand: 'Timberland'
        },
        {
            id: 17,
            name: 'Bolso Tote Michael Kors',
            price: 199.00,
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80',
            category: 'woman',
            size: ['Única'],
            color: 'Marrón',
            brand: 'Michael Kors'
        },
        {
            id: 18,
            name: 'Forro Polar Patagonia',
            price: 120.00,
            image: 'https://images.unsplash.com/photo-1551488852-081bd4c9a66f?w=500&q=80',
            category: 'men',
            size: ['M', 'L', 'XL', 'XXL'],
            color: 'Verde Oliva',
            brand: 'Patagonia'
        },
        {
            id: 19,
            name: 'Vestido Princesa Disney',
            price: 45.50,
            image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&q=80',
            category: 'kids',
            size: ['XS', 'S', 'M'],
            color: 'Azul Hielo',
            brand: 'Disney'
        },
        {
            id: 20,
            name: 'Blazer Ejecutiva Mango',
            price: 59.99,
            image: 'https://images.unsplash.com/photo-1548624197-62dd1793255c?w=500&q=80',
            category: 'woman',
            size: ['36', '38', '40', '42'],
            color: 'Beige',
            brand: 'Mango'
        }
    ]);

    /**
     * API Pública: Exponemos la señal como de solo lectura.
     * Los componentes nunca deben mutar el estado global directamente.
     */
    public readonly products = this.#products.asReadonly();

    /**
     * Retorna una señal computada que filtra los productos por categoría.
     * Util para obtener un subconjunto reactivo sin duplicar listas.
     */
    public getProductsByCategory(category: string) {
        return computed(() =>
            this.#products().filter(product => product.category === category)
        );
    }

    /**
     * Retorna un producto específico por ID, de forma reactiva.
     */
    public getProductById(id: number) {
        return computed(() =>
            this.#products().find(product => product.id === id)
        );
    }
}
