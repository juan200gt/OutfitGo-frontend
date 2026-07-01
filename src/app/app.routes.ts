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
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

// Importamos los Guards
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
    // 🌍 RUTAS PÚBLICAS (Sin restricciones)
    {
        path: '',
        component: HomePageComponent,
        title: 'Inicio'
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
        path: 'producto/:slug',
        loadComponent: () => import('./pages/product-detail-page/product-detail-page.component').then(m => m.ProductDetailPageComponent)
    },
    {
        path: 'outfit-wizard', 
        component: OutfitWizardComponent,
        title: 'Asistente de Outfits (IA)'
    },

    // 🛑 RUTAS DE INVITADO (Solo si NO estás logueado)
    {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [guestGuard],
        title: 'Iniciar Sesión'
    },
    {
        path: 'register',
        component: RegisterPageComponent,
        canActivate: [guestGuard],
        title: 'Registrarse'
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordPageComponent,
        canActivate: [guestGuard],
        title: 'Recuperar Contraseña'
    },
    {
        path: 'reset-password',
        component: ResetPasswordPageComponent,
        canActivate: [guestGuard],
        title: 'Restablecer Contraseña'
    },

    // 🔒 RUTAS PRIVADAS (Solo si SÍ estás logueado)
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent),
        canActivate: [authGuard],
        title: 'Mi Perfil'
    },
    {
        path: 'mis-pedidos',
        loadComponent: () => import('./components/historial-pedidos/historial-pedidos.component').then(m => m.HistorialPedidosComponent),
        canActivate: [authGuard],
        title: 'Mis Pedidos'
    },
    {
        path: 'checkout',
        component: CheckoutPageComponent,
        canActivate: [authGuard],
        title: 'Finalizar Compra'
    },
    {
        path: 'checkout/success',
        component: CheckoutSuccessPageComponent,
        canActivate: [authGuard],
        title: 'Compra Exitosa'
    },
    {
        path: 'favoritos',
        loadComponent: () => import('./pages/favorites-page/favorites-page.component').then(m => m.FavoritesPageComponent),
        canActivate: [authGuard],
        title: 'Mis Favoritos'
    },

    // 🗑️ RUTA COMODÍN (Cualquier error 404)
    {
        path: '**',
        component: NotFoundPageComponent,
        title: 'Página no encontrada'
    }
];