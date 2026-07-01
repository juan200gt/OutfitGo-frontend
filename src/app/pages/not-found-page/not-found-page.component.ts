import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found-page',
    standalone: true,
    imports: [RouterLink],
    template: `
        <div class="not-found-container">
            <div class="not-found-content">
                <span class="error-code">404</span>
                <h1>Página no encontrada</h1>
                <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
                <a routerLink="/" class="btn-home">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    Volver al inicio
                </a>
            </div>
        </div>
    `,
    styles: [`
        .not-found-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 70vh;
            padding: 2rem;
            text-align: center;
        }
        .not-found-content {
            max-width: 480px;
        }
        .error-code {
            font-size: 8rem;
            font-weight: 800;
            line-height: 1;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        h1 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1e293b;
            margin: 1rem 0 0.5rem;
        }
        p {
            color: #64748b;
            margin-bottom: 2rem;
            font-size: 1rem;
        }
        .btn-home {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-home:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }
    `]
})
export class NotFoundPageComponent {}
