import { Product } from '../interfaces/product.interface';
import { User } from '../interfaces/auth.interface';
import { CartItem } from '../interfaces/cart.interface';

export const MOCK_PRODUCTS: Product[] = [
    { id: 1, name: 'Camiseta Básica Blanca', price: 19.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'man', size: ['S', 'M', 'L'], color: 'Blanco', brand: 'OutfitGo' },
    { id: 2, name: 'Chaqueta Vaquera Clásica', price: 49.99, image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'woman', size: ['S', 'M', 'L'], color: 'Azul', brand: 'OutfitGo' },
    { id: 3, name: 'Zapatillas Deportivas', price: 89.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'man', size: ['40', '41', '42'], color: 'Rojo', brand: 'Nike' },
    { id: 4, name: 'Abrigo de Lana Elegante', price: 129.99, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'woman', size: ['M', 'L'], color: 'Gris', brand: 'Zara' },
    { id: 5, name: 'Pantalones Cargo', price: 39.99, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'man', size: ['M', 'L', 'XL'], color: 'Verde Oliva', brand: 'OutfitGo' },
    { id: 6, name: 'Vestido Floral Verano', price: 29.99, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'woman', size: ['S', 'M'], color: 'Multicolor', brand: 'H&M' },
    { id: 7, name: 'Sudadera con Capucha Niño', price: 24.99, image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', category: 'kids', size: ['4Y', '6Y', '8Y'], color: 'Azul Marino', brand: 'OutfitGo' }
];

export const MOCK_USERS: User[] = [
    { id: 1, name: 'Administrador', email: 'admin@admin.com' },
    { id: 2, name: 'Cliente', email: 'cliente@outfitgo.com' }
];

export const MOCK_CART: CartItem[] = [
    {
        id: 1,
        cantidad: 2,
        subtotal: 39.98,
        producto: { id: 1, nombre: 'Camiseta Básica Blanca', slug: 'camiseta-basica', precio: '19.99', url_imagen_principal: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', stock: 10 },
        creado_en: new Date().toISOString(),
        actualizado_en: new Date().toISOString()
    }
];
