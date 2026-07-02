import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'; 
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OutfitService } from '../../services/outfit.service';
import { OutfitResponse } from '../../interfaces/outfit.interface';

@Component({
  selector: 'app-outfit-wizard',
  standalone: true,
  imports: [FormsModule, RouterLink], 
  templateUrl: './outfit-wizard.component.html'
})
export class OutfitWizardComponent {
  #outfitService = inject(OutfitService);
  #destroyRef = inject(DestroyRef); 

  userPrompt = signal('');
  isProcessing = signal(false);
  resultado = signal<OutfitResponse | null>(null);
  errorMsg = signal<string | null>(null);

  isSubmitDisabled = computed(() => {
    return this.isProcessing() || this.userPrompt().trim().length === 0;
  });

  pedirRecomendacion() {
    if (this.isSubmitDisabled()) return;

    this.isProcessing.set(true);
    this.resultado.set(null);
    this.errorMsg.set(null);

    this.#outfitService.generarOutfit(this.userPrompt())
      .pipe(takeUntilDestroyed(this.#destroyRef)) 
      .subscribe({
        next: (res) => {
          this.resultado.set(res);
          this.isProcessing.set(false);
        },
        error: (err) => {
          console.error('Error contactando con la IA:', err);
          this.errorMsg.set('Hubo un problema al contactar a nuestro IA Personal. Inténtelo de nuevo más tarde.');
          this.isProcessing.set(false);
        }
      });
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img.src.includes('no-image.png') || img.src.includes('data:image')) {
      img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23ccc"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%23666">No Image</text></svg>';
      return;
    }
    img.src = '/OutfitGo-frontend/no-image.png';
  }
}
