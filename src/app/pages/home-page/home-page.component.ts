import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HomeReviewsComponent } from '../../components/home-reviews/home-reviews.component';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [RouterLink, TranslateModule, HomeReviewsComponent],
    templateUrl: './home-page.component.html'
})
export class HomePageComponent {

}
