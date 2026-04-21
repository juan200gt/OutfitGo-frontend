import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeReviewsComponent } from '../../components/home-reviews/home-reviews.component';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [RouterLink, HomeReviewsComponent],
    templateUrl: './home-page.component.html'
})
export class HomePageComponent {

}
