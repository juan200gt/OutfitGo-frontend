export interface CartProduct {
    id: number;
    nombre: string;
    slug: string;
    precio: string;
    url_imagen_principal: string;
    stock: number;
}

export interface CartItem {
    id: number;
    cantidad: number;
    subtotal: number;
    producto: CartProduct;
    creado_en: string;
    actualizado_en: string;
}

export interface CartResponse {
    data: CartItem[];
}
