import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserAddress } from '../interfaces/address.interface';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/addresses`;

  getAddresses(): Observable<UserAddress[]> {
    return this.http.get<UserAddress[]>(this.apiUrl);
  }

  createAddress(address: UserAddress): Observable<any> {
    return this.http.post(this.apiUrl, address);
  }

  updateAddress(id: number, address: UserAddress): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, address);
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  setPrimary(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/set-primary`, {});
  }
}