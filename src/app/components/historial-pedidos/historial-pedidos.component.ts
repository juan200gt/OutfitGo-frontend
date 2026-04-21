import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../interfaces/pedido.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-historial-pedidos',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, TranslateModule],
  templateUrl: './historial-pedidos.component.html',
  styleUrls: ['./historial-pedidos.component.css']
})
export class HistorialPedidosComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private translate = inject(TranslateService);

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
        this.error.set(this.translate.instant('ORDERS.ERROR_LOAD'));
        this.cargando.set(false);
      }
    });
  }

  cancelar(pedidoId: number) {
    if (confirm(this.translate.instant('ORDERS.CONFIRM_CANCEL'))) {
      this.pedidoService.cancelarPedido(pedidoId).subscribe({
        next: () => {
          alert(this.translate.instant('ORDERS.CANCEL_SUCCESS'));
          this.pedidos.update((listaActual: Pedido[]) => 
            listaActual.map((p: Pedido) => 
              p.id === pedidoId ? { ...p, estado: 'cancelled' } : p
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
      this.pedidoService.solicitarDevolucion(pedidoId).subscribe({
        next: () => {
          alert(this.translate.instant('ORDERS.RETURN_SUCCESS'));
          this.pedidos.update((listaActual: Pedido[]) => 
            listaActual.map((p: Pedido) => 
              p.id === pedidoId ? { ...p, estado: 'return_requested' } : p
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