import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Journal} from '../Entities/journal/journal.module';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private apiUrl = 'https://localhost:7023/api/journal';

  constructor(private http: HttpClient) {}

  createJournal(journal: Journal): Observable<Journal> {
    return this.http.post<Journal>(this.apiUrl, journal);
  }
}
