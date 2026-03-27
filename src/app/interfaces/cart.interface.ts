export interface CartProduct {
    id: number;
    nombre: string;
    slug: string;
    precio: string;
    url_imagen_principal: string;
}

export interface CartVariant {
    id: number;
    stock: number;
    talla: { nombre: string };
    color: { nombre: string };
    producto: CartProduct;
}

export interface CartItem {
    id: number;
    cantidad: number;
    subtotal: number;
    variante: CartVariant;
    creado_en: string;
    actualizado_en: string;
}

export interface CartResponse {
    data: CartItem[];
}