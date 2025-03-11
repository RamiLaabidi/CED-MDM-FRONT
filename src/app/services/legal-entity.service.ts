import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LegalEntityService {
  private apiUrl = 'https://localhost:7023/api/LegalEntity'; // Assurez-vous que l'URL est correcte

  constructor(private http: HttpClient) {}

  getCurrencyCode(shortName: string, longName: string): Observable< any > {
    const params = new HttpParams()
      .set('shortName', shortName)
      .set('longName', longName);

    return this.http.get< any>(`${this.apiUrl}/currency`, { params });
  }



  getExactAdministrationById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/ExactAdministration`);
  }
}
