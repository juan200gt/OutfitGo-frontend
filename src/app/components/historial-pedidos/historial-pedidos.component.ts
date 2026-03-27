import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../interfaces/pedido.interface';


@Component({
  selector: 'app-historial-pedidos',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe],
  templateUrl: './historial-pedidos.component.html',
  styleUrls: ['./historial-pedidos.component.css']
})
export class HistorialPedidosComponent implements OnInit {
  private pedidoService = inject(PedidoService);

  pedidos = signal<Pedido[]>([]); 
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.pedidoService.obtenerMisPedidos().subscribe({
      next: (datos: any) => {
        this.pedidos.set(datos); 
        this.cargando.set(false); 
      },
      error: (err: any) => {
        console.error('Error al cargar historial:', err);
        this.error.set('No hemos podido cargar tus pedidos. Inténtalo de nuevo.');
        this.cargando.set(false);
      }
    });
  }

  cancelar(pedidoId: number) {
    if (confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
      this.pedidoService.cancelarPedido(pedidoId).subscribe({
        next: (respuesta: any) => {
          alert('Pedido cancelado correctamente.');
          this.pedidos.update((listaActual: Pedido[]) => 
            listaActual.map((p: Pedido) => 
              p.id === pedidoId ? { ...p, estado: 'cancelado' } : p
            )
          );
        },
        error: (err: any) => {
          alert(err.error.message || 'Error al cancelar el pedido');
        }
      });
    }
  }

  devolver(pedidoId: number) {
    if (confirm('¿Estás seguro de que quieres devolver este pedido?')) {
      this.pedidoService.solicitarDevolucion(pedidoId).subscribe({
        next: (respuesta: any) => {
          alert('Devolución solicitada correctamente.');
          this.pedidos.update((listaActual: Pedido[]) => 
            listaActual.map((p: Pedido) => 
              p.id === pedidoId ? { ...p, estado: 'devolucion_solicitada' } : p
            )
          );
        },
        error: (err: any) => {
          alert(err.error.message || 'Error al devolver el pedido');
        }
      });
    }
  }
}