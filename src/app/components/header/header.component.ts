import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    isLoggedIn = input<boolean>(false);
}
