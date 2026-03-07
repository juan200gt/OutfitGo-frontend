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
