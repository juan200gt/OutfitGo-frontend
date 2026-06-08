import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    isLoggedIn = input<boolean>(false);
    cartItemCount = input<number>(0);

    logoutEvent = output<void>();

    onLogout() {
        this.logoutEvent.emit();
    }
}

