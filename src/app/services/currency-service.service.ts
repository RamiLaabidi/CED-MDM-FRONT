import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Currency} from '../Entities/currency/currency.module';

@Injectable({
  providedIn: 'root'
})
export class CurrencyServiceService {

  private apiUrl = 'https://localhost:7023/api/Currency/active-ids';


  constructor(private http: HttpClient) {}

  getActiveCurrencyIds(): Observable<Currency[]> {
    return this.http.get<Currency[]>(this.apiUrl);
  }}
