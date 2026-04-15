import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResenaPagina } from '../interfaces/resena-pagina.interface';

@Injectable({
    providedIn: 'root'
})
export class ResenasPaginaService {
    #http = inject(HttpClient);
    #apiUrl = `${environment.apiUrl}/resenas-pagina`;

    getResenasPagina(): Observable<ResenaPagina[]> {
        return this.#http.get<ResenaPagina[]>(this.#apiUrl);
    }
}
