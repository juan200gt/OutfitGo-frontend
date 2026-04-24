import { Routes } from '@angular/router';
import { OutfitWizardComponent } from './pages/outfit-wizard/outfit-wizard.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { CheckoutSuccessPageComponent } from './pages/checkout-success-page/checkout-success-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { ForgotPasswordPageComponent } from './pages/forgot-password-page/forgot-password-page.component';
import { ResetPasswordPageComponent } from './pages/reset-password-page/reset-password-page.component';


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
        path: 'forgot-password',
        component: ForgotPasswordPageComponent,
        title: 'Recuperar Contraseña'
    },
    {
        path: 'reset-password',
        component: ResetPasswordPageComponent,
        title: 'Restablecer Contraseña'
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent),
        title: 'Mi Perfil'
    },
    {
        path: 'contacto',
        component: ContactPageComponent,
        title: 'Atención al Cliente'
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
        path: 'outfit-wizard', 
        component: OutfitWizardComponent,
        title: 'Asistente de Outfits (IA)'
    },
    {
        path: '**',
        redirectTo: ''
    }
];
