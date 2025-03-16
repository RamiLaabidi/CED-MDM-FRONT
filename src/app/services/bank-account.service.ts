import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BankAccount} from '../Entities/bank-account/bank-account.module';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  private apiUrl = 'https://localhost:7023/api/BankAccount'; // Assurez-vous que l'URL correspond à votre API

  constructor(private http: HttpClient) { }

  getBankAccountByLegalEntity(legalEntityId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/iban/${legalEntityId}`);
  }
}
