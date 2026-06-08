import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../interfaces/order.interface';

@Component({
  selector: 'app-historial-pedidos',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe],
  templateUrl: './historial-pedidos.component.html',
  styleUrls: ['./historial-pedidos.component.css']
})
export class HistorialPedidosComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);

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
        this.error.set('Error al cargar el historial de pedidos.');
        this.cargando.set(false);
      }
    });
  }

  iniciarSimulacionEntrega() {
    this.pedidos().forEach(pedido => {
      if (pedido.estado === 'pagado' || pedido.estado === 'entregando') {
        const now = new Date();
        const updatedTime = new Date(pedido.updated_at || pedido.created_at);
        const secondsElapsed = Math.floor((now.getTime() - updatedTime.getTime()) / 1000);

        if (pedido.estado === 'pagado') {
          const delay1 = Math.max(0, 10000 - secondsElapsed * 1000);
          const timer1 = setTimeout(() => {
            this.pedidos.update(pedidos => pedidos.map(p => 
              p.id === pedido.id && p.estado === 'pagado' 
                ? { ...p, estado: 'entregando' } : p
            ));
          }, delay1);
          this.deliveryTimers.push(timer1);
        }

        const delay2 = Math.max(0, 15000 - secondsElapsed * 1000);
        const timer2 = setTimeout(() => {
          this.pedidos.update(pedidos => pedidos.map(p => 
            p.id === pedido.id && (p.estado === 'pagado' || p.estado === 'entregando') 
              ? { ...p, estado: 'entregado' } : p
          ));
        }, delay2);
        
        this.deliveryTimers.push(timer2);
      }
    });
  }

  cancelar(pedidoId: number) {
    if (confirm("¿Estás seguro de que quieres cancelar este pedido?")) {
      this.orderService.cancelOrder(pedidoId).subscribe({
        next: () => {
          alert("Pedido cancelado correctamente.");
          this.pedidos.update((listaActual: Order[]) => 
            listaActual.map((p: Order) => 
              p.id === pedidoId ? { ...p, estado: 'cancelado' } : p
            )
          );
        },
        error: (err: any) => {
          alert(err.error?.message || 'Hubo un error inesperado al procesar tu solicitud.');
        }
      });
    }
  }

  devolver(pedidoId: number) {
    if (confirm("¿Estás seguro de que quieres devolver este pedido?")) {
      this.orderService.requestReturn(pedidoId).subscribe({
        next: () => {
          alert("Devolución solicitada correctamente.");
          this.pedidos.update((listaActual: Order[]) => 
            listaActual.map((p: Order) => 
              p.id === pedidoId ? { ...p, estado: 'devolucion_solicitada' } : p
            )
          );
        },
        error: (err: any) => {
          alert(err.error?.message || 'Hubo un error inesperado al procesar tu solicitud.');
        }
      });
    }
  }

  getEstadoLabel(estado: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendiente',
      'completed': 'Pagado',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado',
      'refunded': 'Reembolsado',
      'return_requested': 'Devolución en trámite',
      'pendiente': 'Pendiente',
      'pagado': 'Pagado',
      'cancelado': 'Cancelado',
      'devolucion_solicitada': 'Devolución en trámite',
      'devuelto': 'Devuelto',
      'entregando': 'Entregando',
      'entregado': 'Entregado'
    };
    return statusMap[estado.toLowerCase()] || estado;
  }
}
