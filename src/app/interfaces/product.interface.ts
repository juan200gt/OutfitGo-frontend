export interface Product {
    id: number;
    name: string;
    nombre_localizado?: string;
    slug: string;
    price: number;
    description: string;
    descripcion_localizada?: string;
    colors: { id: number; nombre: string; hex_code: string }[]; 
    stock: number;
    image: string;
    gallery: string[];
    category: 'man' | 'woman' | 'kids';
    size: string[];
    color: string;
    brand: string;
    variants: { size: string; color: string; stock: number }[];
}

export interface CartItem extends Product {
    quantity: number;
}

export interface BackendMarca {
    nombre: string;
}

export interface BackendColor {
    id: number;
    nombre: string;
    hex_code: string;
}

export interface BackendTalla {
    id: number;
    nombre: string;
}

export interface BackendProduct {
    id: number;
    nombre: string;
    nombre_localizado?: string;
    slug: string;
    precio: string;
    descripcion: string;
    descripcion_localizada?: string;
    url_imagen_principal: string;
    imagenes?: { url_imagen: string }[];
    publico: string;
    marca: BackendMarca;
    stock: number;
    tallas: BackendTalla[];
    colores: BackendColor[];
    variantes?: { stock: number; talla: { nombre: string }; color: { nombre: string } }[];
}

export interface PaginatedResponse {
    current_page: number;
    data: BackendProduct[];
    total: number;
    filtros_disponibles?: {
        categorias: { id: number, nombre: string, nombre_localizado?: string }[];
        marcas: { id: number, nombre: string }[];
        colores: { id: number, nombre: string }[];
        tallas: { id: number, nombre: string }[];
    };
}