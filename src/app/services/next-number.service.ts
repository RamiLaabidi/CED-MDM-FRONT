import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NextNumber} from '../Entities/next-number/next-number.module';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NextNumberService {
  private apiUrl = 'https://localhost:7023/api/NextNumber'; // Assurez-vous que l'URL correspond à votre backend

  constructor(private http: HttpClient) {}


  // Ajouter un NextNumber
  addNextNumber(nextNumber: NextNumber): Observable<NextNumber> {
    return this.http.post<NextNumber>(`${this.apiUrl}/add`, nextNumber);
  }

  // Récupérer un NextNumber par ID
  getNextNumber(id: number): Observable<NextNumber> {
    return this.http.get<NextNumber>(`${this.apiUrl}/${id}`);
  }
  getLastEntry(): Observable<NextNumber> {
    return this.http.get<NextNumber>(`${this.apiUrl}/last`);
  }
}
