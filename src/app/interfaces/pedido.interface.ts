export interface OrderItem {
  id: number;
  order_id: number;
  producto_id: number;
  cantidad: number;
  precio: number;
}

export interface Pedido {
  id: number;
  user_id: number;
  total: number;
  estado: string;
  nombre: string;
  apellidos: string;
  direccion: string;
  ciudad: string;
  codigo_postal: string;
  created_at: string;
  order_items: OrderItem[];
}

export interface HistorialResponse {
  message: string;
  pedidos: Pedido[];
}