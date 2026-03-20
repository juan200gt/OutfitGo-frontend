import { Component, input, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-checkout-form',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './checkout-form.component.html'
})
export class CheckoutFormComponent {
    isProcessing = input<boolean>(false);
    submitPayment = output<any>();

    checkoutForm = new FormGroup({
        cardholderName: new FormControl('', Validators.required),
        cardNumber: new FormControl('', [Validators.required, Validators.minLength(16)]),
        expiryDate: new FormControl('', Validators.required),
        cvv: new FormControl('', [Validators.required, Validators.minLength(3)]),
        shippingAddress: new FormControl('', Validators.required)
    });

    onSubmit() {
        if (this.checkoutForm.valid && !this.isProcessing()) {
            this.submitPayment.emit(this.checkoutForm.value);
        } else {
            this.checkoutForm.markAllAsTouched();
        }
    }
}
