import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Pedido, HistorialResponse } from '../interfaces/pedido.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private http = inject(HttpClient);
  
    #apiUrl = environment.apiUrl;

  obtenerMisPedidos(): Observable<Pedido[]> {
    return this.http.get<HistorialResponse>(`${this.#apiUrl}/pedidos`).pipe(
      map(respuesta => respuesta.pedidos)
    );
  }
  cancelarPedido(id: number): Observable<any> {
    return this.http.post(`${this.#apiUrl}/pedidos/${id}/cancelar`, {});
  }

  solicitarDevolucion(id: number): Observable<any> {
    return this.http.post(`${this.#apiUrl}/pedidos/${id}/devolver`, {});
  }
  
}