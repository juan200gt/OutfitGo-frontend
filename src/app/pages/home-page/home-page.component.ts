import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ResenasPortadaComponent } from '../../components/resenas-portada/resenas-portada.component';
import { HomeReviewsComponent } from '../../components/home-reviews/home-reviews.component';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [RouterLink, TranslateModule, ResenasPortadaComponent, HomeReviewsComponent],
    templateUrl: './home-page.component.html'
})
export class HomePageComponent {

}
