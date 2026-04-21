import { 
  Component, 
  ElementRef, 
  OnDestroy, 
  inject, 
  input, 
  viewChild 
} from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';

Chart.register(...registerables);

@Component({
  selector: 'app-price-chart',
  standalone: true,
  template: '<canvas #priceCanvas></canvas>',
  styles: [':host { display: block; position: relative; width: 100%; height: 300px; } canvas { max-height: 100%; width: 100%; }']
})
export class PriceChartComponent implements OnDestroy {
  productoId = input.required<number>();
  
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('priceCanvas');
  
  #productoService = inject(ProductService);
  
  private chartInstance: Chart | null = null;
  private dataSub: Subscription;

  constructor() {
    this.dataSub = toObservable(this.productoId).pipe(
      takeUntilDestroyed(), 
      switchMap(id => this.#productoService.getHistorialPrecios(id))
    ).subscribe({
      next: (data) => {
        this.renderChart(data.labels, data.precios);
      },
      error: (err) => console.error('Error cargando la gráfica', err)
    });
  }

  private renderChart(labels: string[], precios: number[]) {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(this.canvas().nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Evolución de Precio (€)',
          data: precios,
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: { 
          legend: { display: false } 
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
}
