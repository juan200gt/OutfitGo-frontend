import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, TranslateModule, LanguageSelectorComponent],
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    isLoggedIn = input<boolean>(false);
    cartItemCount = input<number>(0);

    logoutEvent = output<void>();

    onLogout() {
        this.logoutEvent.emit();
    }

    closeDropdown() {
        if (typeof document !== 'undefined') {
            (document.activeElement as HTMLElement)?.blur();
        }
    }
}
