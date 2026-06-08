import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeReviewsComponent } from '../../components/home-reviews/home-reviews.component';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [RouterLink, HomeReviewsComponent],
    templateUrl: './home-page.component.html',
    encapsulation: ViewEncapsulation.None
})
export class HomePageComponent {
    mouseX = 0;
    mouseY = 0;

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        this.mouseX = (window.innerWidth / 2 - event.clientX) / 30;
        this.mouseY = (window.innerHeight / 2 - event.clientY) / 30;
    }
}

