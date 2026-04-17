import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ResenasPortadaComponent } from '../../components/resenas-portada/resenas-portada.component';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [RouterLink, TranslateModule, ResenasPortadaComponent],
    templateUrl: './home-page.component.html'
})
export class HomePageComponent {

}
