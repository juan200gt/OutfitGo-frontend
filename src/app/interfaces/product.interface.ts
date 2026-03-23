export interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string;
    category: 'man' | 'woman' | 'kids';
    size: string[];
    color: string;
    brand: string;
}

export interface PaginatedResponse {
    current_page: number;
    data: BackendProduct[];
    total: number;
    filtros_disponibles?: {
        categorias: { id: number, nombre: string }[];
        marcas: { id: number, nombre: string }[];
        colores: { id: number, nombre: string }[];
        tallas: { id: number, nombre: string }[];
    };
}

export interface CartItem extends Product {
    quantity: number;
}

export interface BackendMarca {
    nombre: string;
}

export interface BackendColor {
    nombre: string;
}

export interface BackendTalla {
    nombre: string;
}

export interface BackendProduct {
    id: number;
    nombre: string;
    slug: string;
    precio: string;
    url_imagen_principal: string;
    publico: string;
    marca: BackendMarca;
    tallas: BackendTalla[];
    colores: BackendColor[];
}

export interface PaginatedResponse {
    data: BackendProduct[];
}
