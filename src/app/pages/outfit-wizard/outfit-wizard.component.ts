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
    (event.target as HTMLImageElement).src = '/no-image.png';
  }
}
