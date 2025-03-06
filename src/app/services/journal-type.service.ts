import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {JournalType} from '../Entities/journal-type/journal-type.module';

@Injectable({
  providedIn: 'root'
})
export class JournalTypeService {
  private apiUrl = 'https://localhost:7023/api/JournalType'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) {}

  getAllJournalTypes(): Observable<JournalType[]> {
    return this.http.get<JournalType[]>(this.apiUrl);
  }
}
