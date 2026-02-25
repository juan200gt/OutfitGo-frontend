import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css' // CSS opcional para los estilos
})
export class HeaderComponent {
    // --- Inputs: recibimos estado desde el componente superior ---
    cartCount = input<number>(0);
    isLoggedIn = input<boolean>(false);
    isSearchVisible = input<boolean>(false);

    // --- Outputs: emitimos eventos hacia el componente superior ---
    onSearch = output<string>();
    onToggleSearch = output<void>();

    handleSearch(query: string) {
        this.onSearch.emit(query);
    }

    handleToggle() {
        this.onToggleSearch.emit();
    }
}
