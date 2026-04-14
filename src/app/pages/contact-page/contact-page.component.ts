import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-contact-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './contact-page.component.html',
    styleUrls: []
})
export class ContactPageComponent {
    faqs = [
        {
            question: 'Disponibilidad de artículos',
            answer: 'Nuestros artículos se reponen semanalmente. Si un artículo no tiene stock, puedes suscribirte a nuestra "Newsletter" para recibir un aviso cuando vuelva a estar disponible.'
        },
        {
            question: 'Mi cuenta',
            answer: 'Puedes gestionar tus datos personales, direcciones y pedidos desde el apartado "Mi Cuenta" tras iniciar sesión.'
        },
        {
            question: 'Cómo devolver un pedido',
            answer: 'Tienes 30 días para realizar devoluciones de forma gratuita a través de nuestra red de puntos de entrega o solicitando recogida a domicilio.'
        },
        {
            question: 'Garantía de los productos',
            answer: 'Todos nuestros productos han sido sometidos a controles de calidad para poder ofrecer la mejor experiencia , sin embargo si encuentras algún defecto en tu producto, no dudes en contactar con nuestro equipo de atención al cliente.'
        },
        {
            question: 'Métodos de pago',
            answer: 'Puedes pagar tus compras con tarjeta de crédito o débito, PayPal o bizum.'
        },
        {
            question: 'Métodos de envio, plazo y costes',
            answer: 'Las opciones de envío pueden variar en función de la dirección de entrega, la hora en la que realices tu pedido y la disponibilidad de los artículos. En el momento de procesar tu pedido te mostraremos los métodos de envío disponibles, el coste y la fecha estimada de entrega. Ten en cuenta que las entregas se realizan solo en días laborables.'
        }
    ];
}