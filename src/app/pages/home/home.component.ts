import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home-page',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomePageComponent {
    #router = inject(Router);

    navigateToProducts(category: string): void {
        this.#router.navigate(['/products', category]);
    }
}
