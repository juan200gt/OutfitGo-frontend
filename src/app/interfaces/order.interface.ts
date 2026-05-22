export interface OrderItem {
  id: number;
  order_id: number;
  producto_id: number;
  cantidad: number;
  precio: number;
  precio_unitario?: number;
  producto?: any;
}

export interface Order {
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
  updated_at?: string;
  order_items: OrderItem[];
}

export interface PaginatedPedidos {
  data: Order[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}

export interface OrderHistoryResponse {
  message: string;
  pedidos: PaginatedPedidos | Order[];
}