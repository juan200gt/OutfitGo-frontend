import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ResenasPortadaComponent } from '../../components/resenas-portada/resenas-portada.component';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [RouterLink, TranslateModule, ResenasPortadaComponent],
    template: `
        <div class="max-w-md">
            <h1 class="mb-5 text-5xl font-bold">{{ 'PAGES.HOME.HERO_TITLE' | translate }}</h1>
            <p class="mb-5 text-lg">
                {{ 'PAGES.HOME.HERO_DESC' | translate }}
            </p>
            <a routerLink="/products/all" class="btn btn-primary shadow-lg">{{ 'PAGES.HOME.VIEW_COLLECTION' | translate }}</a>
        </div>
    `
})
export class HomePageComponent {

}
