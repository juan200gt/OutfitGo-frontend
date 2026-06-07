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
        { question: '¿Cuánto tarda en llegar mi pedido?', answer: 'Los envíos estándar tardan entre 3 y 5 días laborables. El envío exprés tarda de 24 a 48 horas.' },
        { question: '¿Puedo devolver un artículo?', answer: 'Sí, tienes 30 días desde la recepción del pedido para solicitar una devolución de forma gratuita.' },
        { question: '¿Cómo realizo el seguimiento de mi envío?', answer: 'Puedes ver el estado en tiempo real desde la sección "Mis Pedidos" en tu perfil de usuario.' },
        { question: '¿Qué métodos de pago están disponibles?', answer: 'Aceptamos pagos con tarjeta de crédito, débito, y pagos seguros mediante Stripe.' },
        { question: '¿Las tallas coinciden con el estándar?', answer: 'Nuestras prendas siguen un tallaje estándar europeo. Consulta la guía de tallas en cada producto para más seguridad.' },
        { question: 'He recibido un artículo defectuoso, ¿qué hago?', answer: 'Sentimos el inconveniente. Ponte en contacto con nosotros lo antes posible mediante WhatsApp o teléfono para solucionarlo.' }
    ];
}