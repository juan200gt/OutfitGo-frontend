export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: 'man' | 'woman' | 'kids';
    size: string[];
    color: string;
    brand: string;
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
