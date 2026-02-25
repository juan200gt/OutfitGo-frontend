export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    size: string[];
    color: string;
    brand: string;
}

export interface CartItem extends Product {
    quantity: number;
}
