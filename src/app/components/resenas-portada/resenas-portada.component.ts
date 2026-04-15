import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ResenaPagina } from '../../interfaces/resena-pagina.interface';
import { ResenasPaginaService } from '../../services/resenas-pagina.service';

@Component({
    selector: 'app-resenas-portada',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './resenas-portada.component.html'
})
export class ResenasPortadaComponent implements OnInit {
    #resenasPaginaService = inject(ResenasPaginaService);

    resenas: ResenaPagina[] = [];

    ngOnInit(): void {
        this.#resenasPaginaService.getResenasPagina().subscribe({
            next: (resenas: ResenaPagina[]) => {
                this.resenas = resenas;
            },
            error: (error: unknown) => {
                console.error('No se pudieron cargar las reseñas de portada.', error);
            }
        });
    }

    getEstrellas(puntuacion: number): number[] {
        return Array.from({ length: puntuacion }, (_, index) => index);
    }
}
