import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Order, OrderHistoryResponse } from '../interfaces/order.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  
    #apiUrl = environment.apiUrl;

  getMyOrders(): Observable<Order[]> {
    return this.http.get<OrderHistoryResponse>(`${this.#apiUrl}/pedidos`).pipe(
      map(respuesta => respuesta.pedidos)
    );
  }
  cancelOrder(id: number): Observable<any> {
    return this.http.post(`${this.#apiUrl}/pedidos/${id}/cancelar`, {});
  }

  requestReturn(id: number): Observable<any> {
    return this.http.post(`${this.#apiUrl}/pedidos/${id}/devolver`, {});
  }
  
}