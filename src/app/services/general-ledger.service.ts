import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GeneralLedger} from '../Entities/general-ledger/general-ledger.module';

@Injectable({
  providedIn: 'root'
})
export class GeneralLedgerService {

  private apiUrl = 'https://localhost:7023/api/GeneralLedger';

  constructor(private http: HttpClient) {}

  /*getActiveGeneralLedgers(legalEntityId: string): Observable<GeneralLedger[]> {
    return this.http.get<GeneralLedger[]>(`${this.apiUrl}/by-legal-entity/${legalEntityId}`);
  }*/

  getActiveGeneralLedgers(): Observable<GeneralLedger[]> {
    return this.http.get<GeneralLedger[]>(`${this.apiUrl}/active`);
  }

  getById(glId: string): Observable<GeneralLedger> {
    return this.http.get<GeneralLedger>(`${this.apiUrl}/${glId}`);
  }

  updateGL(glId: string, generalLedger: GeneralLedger): Observable<GeneralLedger> {
    return this.http.put<GeneralLedger>(`${this.apiUrl}/${glId}`, generalLedger);
  }

  createGL(generalLedger: GeneralLedger): Observable<GeneralLedger> {
    return this.http.post<GeneralLedger>(this.apiUrl, generalLedger);
  }
  getAllGeneralLedgers(): Observable<GeneralLedger[]> {
    return this.http.get<GeneralLedger[]>(this.apiUrl);
  }
}
