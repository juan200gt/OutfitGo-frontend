import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomePageComponent,
        title: 'OutfitGo - Inicio'
    },
    {
        path: '**',
        redirectTo: ''
    }
];

