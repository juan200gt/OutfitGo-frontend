import { Component, inject, OnInit, signal, output, viewChild, ElementRef } from '@angular/core';
import { AddressService } from '../../services/address.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAddress } from '../../interfaces/address.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-address-selector',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './address-selector.component.html'
})
export class AddressSelectorComponent implements OnInit {
  private addressService = inject(AddressService);
  private fb = inject(FormBuilder);

  addresses = signal<UserAddress[]>([]);
  loading = signal(false);
  selectedId = signal<number | null>(null);
  addressSelected = output<UserAddress>();
  isSaving = signal(false);
  deletingId = signal<number | null>(null);
  deleteModal = viewChild<ElementRef<HTMLDialogElement>>('deleteModal');


  // Nuevo estado para saber si estamos editando
  editingId = signal<number | null>(null);

  addressForm: FormGroup = this.fb.group({
    nombre_direccion: ['', [Validators.required, Validators.maxLength(50)]],
    direccion: ['', [Validators.required, Validators.maxLength(255)]],
    ciudad: ['', [Validators.required, Validators.maxLength(100)]],
    provincia: ['', [Validators.required, Validators.maxLength(100)]],
    codigo_postal: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]+$')]],
    telefono: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('^[+0-9 ]+$')]],
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
        if (primary && primary.id) {
          this.selectAddress(primary);
        }
      },
      error: () => this.loading.set(false)
    });
  }

  // --- FUNCIONES DE GESTIÓN ---

  selectAddress(address: UserAddress) {
    if (address.id) {
      this.selectedId.set(address.id);
      this.addressSelected.emit(address);
    }
  }

  deleteAddress(id: number, event: Event) {
    event.stopPropagation();   // Evita que se seleccione la tarjeta al hacer clic en borrar
    this.deletingId.set(id); // Guardamos la ID que queremos borrar
    this.deleteModal()?.nativeElement.showModal();
  }


  setPrimary(id: number, event: Event) {
    event.stopPropagation();
    this.addressService.setPrimary(id).subscribe(() => this.loadAddresses());
  }

  openNewModal() {
    this.editingId.set(null);
    this.addressForm.reset({ es_principal: false });
    const modal = document.getElementById('address_modal') as HTMLDialogElement;
    if (modal) modal.showModal();
  }

  openEditModal(address: UserAddress, event: Event) {
    event.stopPropagation();
    if (address.id) {
      this.editingId.set(address.id);
      this.addressForm.patchValue(address);
      const modal = document.getElementById('address_modal') as HTMLDialogElement;
      if (modal) modal.showModal();
    }
  }

  saveAddress() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const addressData: UserAddress = this.addressForm.value;
    const currentEditId = this.editingId();

    // Si tenemos un ID, actualizamos. Si no, creamos.
    const request$ = currentEditId
      ? this.addressService.updateAddress(currentEditId, addressData)
      : this.addressService.createAddress(addressData);

    request$.subscribe({
      next: (response) => {
        this.isSaving.set(false);
        this.loadAddresses();
        const modal = document.getElementById('address_modal') as HTMLDialogElement;
        if (modal) modal.close();

        // Si creamos una nueva y nos la devuelve, la seleccionamos
        if (!currentEditId && response.address) {
          this.selectAddress(response.address);
        }
      },
      error: (err) => {
        this.isSaving.set(false);
        console.error(err);
      }
    });
  }

  confirmDelete() {
    const id = this.deletingId();
    if (id) {
      this.addressService.deleteAddress(id).subscribe(() => {
        this.loadAddresses(); // Recargamos la lista
       this.deleteModal()?.nativeElement.close(); // Cerramos el modal
        this.deletingId.set(null); // Limpiamos la variable
      });
    }
  }
}
