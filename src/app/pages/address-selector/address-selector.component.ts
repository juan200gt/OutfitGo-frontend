import { Component, inject, OnInit, signal, output } from '@angular/core';
import { AddressService } from '../../services/address.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAddress } from '../../interfaces/address.interface';

@Component({
  selector: 'app-address-selector',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './address-selector.component.html'
})
export class AddressSelectorComponent implements OnInit {
  private addressService = inject(AddressService);
  private fb = inject(FormBuilder);

  addresses = signal<UserAddress[]>([]);
  loading = signal(false);
  selectedId = 0;
  addressSelected = output<UserAddress>();
  isSaving = signal(false);

  addressForm: FormGroup = this.fb.group({
    nombre_direccion: ['', [Validators.required, Validators.maxLength(50)]],
    direccion: ['', [Validators.required, Validators.maxLength(255)]],
    ciudad: ['', [Validators.required, Validators.maxLength(100)]],
    provincia: ['', [Validators.required, Validators.maxLength(100)]],
    codigo_postal: ['', [
      Validators.required,
      Validators.maxLength(10),
      Validators.pattern('^[0-9]+$')
    ]],
    telefono: ['', [
      Validators.required,
      Validators.maxLength(20),
      Validators.pattern('^[+0-9 ]+$')
    ]],
    es_principal: [false]
  });

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    this.loading.set(true);
    this.addressService.getAddresses().subscribe({
      next: (data) => {
        this.addresses.set(data);
        this.loading.set(false);
        const primary = data.find(a => a.es_principal);
        if (primary) {
          this.selectedId = primary.id!;
          this.addressSelected.emit(primary);
        }
      },
      error: () => this.loading.set(false)
    });
  }

  onAddressChange() {
    const selected = this.addresses().find(a => a.id == this.selectedId);
    if (selected) {
      this.addressSelected.emit(selected);
    }
  }

  saveAddress() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const newAddress: UserAddress = this.addressForm.value;

    this.addressService.createAddress(newAddress).subscribe({
      next: (response) => {
        this.isSaving.set(false);
        this.loadAddresses();
        this.addressForm.reset({ es_principal: false });

        const modal = document.getElementById('address_modal') as HTMLDialogElement;
        if (modal) modal.close();

        if (response.address) {
          this.selectedId = response.address.id;
          this.addressSelected.emit(response.address);
        }
      },
      error: (err) => {
        this.isSaving.set(false);
        console.error(err);
      }
    });
  }
}