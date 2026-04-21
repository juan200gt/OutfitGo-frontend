import { Product } from './product.interface'; 

export interface OutfitResponse {
    productos: Product[];
    explicacion: string;
    motor_usado: string;
}