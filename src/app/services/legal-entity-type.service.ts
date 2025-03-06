import { Injectable } from '@angular/core';
import {LegalEntityType} from '../Entities/legal-entity-type/legal-entity-type.module';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LegalEntityTypeService {
  private apiUrl = 'https://localhost:7023/api/LegalEntityType'; // Remplace par ton URL

  constructor(private http: HttpClient) {}

  getInactiveLegalEntityTypes(): Observable<LegalEntityType[]> {
    return this.http.get<LegalEntityType[]>(`${this.apiUrl}/inactive`);
  }
}
