import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../interfaces/order.interface';

@Component({
  selector: 'app-historial-pedidos',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, RouterLink],
  templateUrl: './historial-pedidos.component.html'
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

  parseDateUtc(dateStr: string | undefined): Date {
    if (!dateStr) return new Date();
    let formatted = dateStr;
    // Si la cadena no contiene Z ni un offset de zona horaria (ej: +02:00), asumimos que está en UTC
    if (!dateStr.includes('Z') && !dateStr.match(/[\+\-]\d{2}:\d{2}$/)) {
      // Reemplazamos el espacio por T si es necesario para formatearlo como ISO-8601
      formatted = dateStr.replace(' ', 'T') + 'Z';
    }
    return new Date(formatted);
  }

  iniciarSimulacionEntrega() {
    this.pedidos().forEach(pedido => {
      const estadoNormalizado = pedido.estado.toLowerCase();
      if (
        estadoNormalizado === 'pagado' || 
        estadoNormalizado === 'completed' || 
        estadoNormalizado === 'entregando' || 
        estadoNormalizado === 'shipped'
      ) {
        // Forzamos que la simulación inicie desde 0 segundos al entrar a la vista
        // para que el usuario pueda apreciar siempre todo el flujo de entrega
        const secondsElapsed = 0;

        // 1. Transición a Entregando (15s reales)
        if (estadoNormalizado === 'pagado' || estadoNormalizado === 'completed') {
          const delay1 = 15000;
          const timer1 = setTimeout(() => {
            this.pedidos.update(pedidos => pedidos.map(p => 
              p.id === pedido.id && (p.estado === 'pagado' || p.estado === 'completed') 
                ? { ...p, estado: p.estado === 'completed' ? 'shipped' : 'entregando' } : p
            ));
          }, delay1);
          this.deliveryTimers.push(timer1);
        }

        // 2. Transición a Entregado (30s reales)
        // Si el estado inicial ya es "entregando", la entrega ocurrirá en 15s en vez de 30s
        const delay2 = (estadoNormalizado === 'entregando' || estadoNormalizado === 'shipped') ? 15000 : 30000;
        const timer2 = setTimeout(() => {
          this.pedidos.update(pedidos => pedidos.map(p => 
            p.id === pedido.id && (
              p.estado === 'pagado' || 
              p.estado === 'completed' || 
              p.estado === 'entregando' || 
              p.estado === 'shipped'
            ) 
              ? { ...p, estado: p.estado === 'completed' || p.estado === 'shipped' ? 'delivered' : 'entregado' } : p
          ));
        }, delay2);
        
        this.deliveryTimers.push(timer2);
      }
    });
  }

  cancelar(pedidoId: number) {
    if (confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
      this.orderService.cancelOrder(pedidoId).subscribe({
        next: () => {
          alert('Pedido cancelado correctamente.');
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
    if (confirm('¿Estás seguro de que quieres devolver este pedido?')) {
      this.orderService.requestReturn(pedidoId).subscribe({
        next: () => {
          alert('Devolución solicitada correctamente.');
          this.pedidos.update((listaActual: Order[]) => 
            listaActual.map((p: Order) => 
              p.id === pedidoId ? { ...p, estado: 'devolucion_solicitada' } : p
            )
          );
        },
        error: (err: any) => {
import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../interfaces/order.interface';

@Component({
  selector: 'app-historial-pedidos',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, RouterLink],
  templateUrl: './historial-pedidos.component.html'
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

  parseDateUtc(dateStr: string | undefined): Date {
    if (!dateStr) return new Date();
    let formatted = dateStr;
    // Si la cadena no contiene Z ni un offset de zona horaria (ej: +02:00), asumimos que está en UTC
    if (!dateStr.includes('Z') && !dateStr.match(/[\+\-]\d{2}:\d{2}$/)) {
      // Reemplazamos el espacio por T si es necesario para formatearlo como ISO-8601
      formatted = dateStr.replace(' ', 'T') + 'Z';
    }
    return new Date(formatted);
  }

  iniciarSimulacionEntrega() {
    this.pedidos().forEach(pedido => {
      const estadoNormalizado = pedido.estado.toLowerCase();
      if (
        estadoNormalizado === 'pagado' || 
        estadoNormalizado === 'completed' || 
        estadoNormalizado === 'entregando' || 
        estadoNormalizado === 'shipped'
      ) {
        // Forzamos que la simulación inicie desde 0 segundos al entrar a la vista
        // para que el usuario pueda apreciar siempre todo el flujo de entrega
        const secondsElapsed = 0;

        // 1. Transición a Entregando (15s reales)
        if (estadoNormalizado === 'pagado' || estadoNormalizado === 'completed') {
          const delay1 = 15000;
          const timer1 = setTimeout(() => {
            this.pedidos.update(pedidos => pedidos.map(p => 
              p.id === pedido.id && (p.estado === 'pagado' || p.estado === 'completed') 
                ? { ...p, estado: p.estado === 'completed' ? 'shipped' : 'entregando' } : p
            ));
          }, delay1);
          this.deliveryTimers.push(timer1);
        }

        // 2. Transición a Entregado (30s reales)
        // Si el estado inicial ya es "entregando", la entrega ocurrirá en 15s en vez de 30s
        const delay2 = (estadoNormalizado === 'entregando' || estadoNormalizado === 'shipped') ? 15000 : 30000;
        const timer2 = setTimeout(() => {
          this.pedidos.update(pedidos => pedidos.map(p => 
            p.id === pedido.id && (
              p.estado === 'pagado' || 
              p.estado === 'completed' || 
              p.estado === 'entregando' || 
              p.estado === 'shipped'
            ) 
              ? { ...p, estado: p.estado === 'completed' || p.estado === 'shipped' ? 'delivered' : 'entregado' } : p
          ));
        }, delay2);
        
        this.deliveryTimers.push(timer2);
      }
    });
  }

  cancelar(pedidoId: number) {
    if (confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
      this.orderService.cancelOrder(pedidoId).subscribe({
        next: () => {
          alert('Pedido cancelado correctamente.');
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
    if (confirm('¿Estás seguro de que quieres devolver este pedido?')) {
      this.orderService.requestReturn(pedidoId).subscribe({
        next: () => {
          alert('Devolución solicitada correctamente.');
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

  getBadgeClass(estado: string): string {
    const est = estado.toLowerCase();
    if (['pending', 'pendiente'].includes(est)) return 'badge-warning border-warning/20 bg-warning/10 text-warning';
    if (['completed', 'delivered', 'entregado', 'pagado'].includes(est)) return 'badge-success border-success/20 bg-success/10 text-success';
    if (['shipped', 'return_requested', 'entregando', 'devolucion_solicitada'].includes(est)) return 'badge-info border-info/20 bg-info/10 text-info';
    if (['cancelled', 'refunded', 'cancelado', 'devuelto'].includes(est)) return 'badge-error border-error/20 bg-error/10 text-error';
    return '';
  }

  getStepProgressWidth(estado: string): string {
    const est = estado.toLowerCase();
    if (['entregado', 'delivered', 'enviado'].includes(est)) return '100%';
    if (['entregando', 'shipped'].includes(est)) return '50%';
    return '0%';
  }

  getStep1Class(estado: string): string {
    const est = estado.toLowerCase();
    if (['pagado', 'completed', 'entregando', 'shipped', 'entregado', 'delivered', 'enviado'].includes(est)) {
      return 'bg-primary border-primary text-white shadow-primary/20';
    }
    return 'bg-base-200 border-base-300 text-base-content/40';
  }

  getStep2Class(estado: string): string {
    const est = estado.toLowerCase();
    if (['entregado', 'delivered', 'enviado'].includes(est)) {
      return 'bg-primary border-primary text-white shadow-primary/20';
    }
    if (['entregando', 'shipped'].includes(est)) {
      return 'bg-primary/20 border-primary text-primary animate-pulse';
    }
    return 'bg-base-200 border-base-300 text-base-content/40';
  }

  getStep3Class(estado: string): string {
    const est = estado.toLowerCase();
    if (['entregado', 'delivered', 'enviado'].includes(est)) {
      return 'bg-success border-success text-white shadow-success/20';
    }
    return 'bg-base-200 border-base-300 text-base-content/40';
  }
}
