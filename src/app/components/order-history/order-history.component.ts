import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../interfaces/order.interface';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe],
  templateUrl: './order-history.component.html'
})
export class OrderHistoryComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]); 
  isLoading = signal<boolean>(true);
  errorMsg = signal<string | null>(null);

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.orderService.getMyOrders().subscribe({
      next: (data: any) => {
        this.orders.set(data); 
        this.isLoading.set(false); 
      },
      error: (err: any) => {
        console.error('Error loading history:', err);
        this.errorMsg.set('We could not load your orders. Try again.');
        this.isLoading.set(false);
      }
    });
  }

  cancelOrder(orderId: number) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: (response: any) => {
          alert('Order canceled successfully.');
          this.orders.update((currentList: Order[]) => 
            currentList.map((o: Order) => 
              o.id === orderId ? { ...o, estado: 'cancelado' } : o
            )
          );
        },
        error: (err: any) => {
          alert(err.error.message || 'Error canceling the order');
        }
      });
    }
  }

  returnOrder(orderId: number) {
    if (confirm('Are you sure you want to return this order?')) {
      this.orderService.requestReturn(orderId).subscribe({
        next: (response: any) => {
          alert('Return requested successfully.');
          this.orders.update((currentList: Order[]) => 
            currentList.map((o: Order) => 
              o.id === orderId ? { ...o, estado: 'devolucion_solicitada' } : o
            )
          );
        },
        error: (err: any) => {
          alert(err.error.message || 'Error returning the order');
        }
      });
    }
  }
}