import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { CheckoutSuccessPageComponent } from './pages/checkout-success-page/checkout-success-page.component';

export const routes: Routes = [
    {
        path: '',
        component: HomePageComponent,
        title: 'Inicio'
    },
    {
        path: 'login',
        component: LoginPageComponent,
        title: 'Iniciar Sesión'
    },
    {
        path: 'register',
        component: RegisterPageComponent,
        title: 'Registrarse'
    },
    {
        path: 'products/all',
        component: ProductsPageComponent,
        title: 'Todos los productos'
    },
    {
        path: 'products/men',
        component: ProductsPageComponent,
        title: 'Productos para hombres'
    },
    {
        path: 'products/women',
        component: ProductsPageComponent,
        title: 'Productos para mujeres'
    },
    {
        path: 'products/kids',
        component: ProductsPageComponent,
        title: 'Productos para niños'
    },
    {
        path: 'cart',
        component: CartPageComponent,
        title: 'Tu Carrito'
    },
    {
        path: 'checkout',
        component: CheckoutPageComponent,
        title: 'Finalizar Compra'
    },
    {
        path: 'checkout/success',
        component: CheckoutSuccessPageComponent,
        title: 'Compra Exitosa'
    },
    {
        path: 'favoritos',
        loadComponent: () => import('./pages/favorites-page/favorites-page.component').then(m => m.FavoritesPageComponent),
        title: 'Mis Favoritos'
    },
    {
        path: 'producto/:slug',
        loadComponent: () => import('./pages/product-detail-page/product-detail-page.component').then(m => m.ProductDetailPageComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
