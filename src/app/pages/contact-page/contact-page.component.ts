import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-contact-page',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './contact-page.component.html',
    styleUrls: []
})
export class ContactPageComponent {
    faqs = [
        { questionKey: 'CONTACT.FAQS.Q1', answerKey: 'CONTACT.FAQS.A1' },
        { questionKey: 'CONTACT.FAQS.Q2', answerKey: 'CONTACT.FAQS.A2' },
        { questionKey: 'CONTACT.FAQS.Q3', answerKey: 'CONTACT.FAQS.A3' },
        { questionKey: 'CONTACT.FAQS.Q4', answerKey: 'CONTACT.FAQS.A4' },
        { questionKey: 'CONTACT.FAQS.Q5', answerKey: 'CONTACT.FAQS.A5' },
        { questionKey: 'CONTACT.FAQS.Q6', answerKey: 'CONTACT.FAQS.A6' }
    ];
}