import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../interfaces/order.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-historial-pedidos',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, TranslateModule],
  templateUrl: './historial-pedidos.component.html',
  styleUrls: ['./historial-pedidos.component.css']
})
export class HistorialPedidosComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  private translate = inject(TranslateService);

  pedidos = signal<Order[]>([]); 
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);
  
  private deliveryTimers: any[] = [];

  ngOnInit() {
    this.cargarHistorial();
  }

  ngOnDestroy() {
    this.deliveryTimers.forEach(timer => clearTimeout(timer));
  }

  cargarHistorial() {
    this.orderService.getMyOrders().subscribe({
      next: (datos: any) => {
        this.pedidos.set(datos); 
        this.cargando.set(false); 
        this.iniciarSimulacionEntrega();
      },
      error: (err: any) => {
        console.error('Error al cargar historial:', err);
        this.error.set(this.translate.instant('ORDERS.ERROR_LOAD'));
        this.cargando.set(false);
      }
    });
  }

  iniciarSimulacionEntrega() {
    this.pedidos().forEach(pedido => {
      if (pedido.estado !== 'cancelled' && pedido.estado !== 'cancelado' && pedido.estado !== 'delivered' && pedido.estado !== 'entregado') {
        const timer1 = setTimeout(() => {
          this.pedidos.update(pedidos => pedidos.map(p => 
            p.id === pedido.id && p.estado !== 'cancelled' && p.estado !== 'cancelado' 
              ? { ...p, estado: 'entregando' } : p
          ));
        }, 10000);
        
        const timer2 = setTimeout(() => {
          this.pedidos.update(pedidos => pedidos.map(p => 
            p.id === pedido.id && p.estado !== 'cancelled' && p.estado !== 'cancelado' 
              ? { ...p, estado: 'entregado' } : p
          ));
        }, 15000);
        
        this.deliveryTimers.push(timer1, timer2);
      }
    });
  }

  cancelar(pedidoId: number) {
    if (confirm(this.translate.instant('ORDERS.CONFIRM_CANCEL'))) {
      this.orderService.cancelOrder(pedidoId).subscribe({
        next: () => {
          alert(this.translate.instant('ORDERS.CANCEL_SUCCESS'));
          this.pedidos.update((listaActual: Order[]) => 
            listaActual.map((p: Order) => 
              p.id === pedidoId ? { ...p, estado: 'cancelado' } : p
            )
          );
        },
        error: (err: any) => {
          alert(err.error?.message || this.translate.instant('ORDERS.ERROR_GENERIC'));
        }
      });
    }
  }

  devolver(pedidoId: number) {
    if (confirm(this.translate.instant('ORDERS.CONFIRM_RETURN'))) {
      this.orderService.requestReturn(pedidoId).subscribe({
        next: () => {
          alert(this.translate.instant('ORDERS.RETURN_SUCCESS'));
          this.pedidos.update((listaActual: Order[]) => 
            listaActual.map((p: Order) => 
              p.id === pedidoId ? { ...p, estado: 'devolucion_solicitada' } : p
            )
          );
        },
        error: (err: any) => {
          alert(err.error?.message || this.translate.instant('ORDERS.ERROR_GENERIC'));
        }
      });
    }
  }
}