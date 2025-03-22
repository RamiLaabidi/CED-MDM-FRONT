import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Journal} from '../Entities/journal/journal.module';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private apiUrl = 'https://localhost:7023/api/journal';

  constructor(private http: HttpClient) {
  }

  createJournal(journal: Journal): Observable<Journal> {
    return this.http.post<Journal>(this.apiUrl, journal);
  }
  getAllJournals(): Observable<Journal[]> {
    return this.http.get<Journal[]>(this.apiUrl);
  }
  updateJournal(jrlId: string, updatedJournal: Journal): Observable<Journal> {
    return this.http.put<Journal>(`${this.apiUrl}/${jrlId}`, updatedJournal);
  }


  getJournalByIdWithSettings(jrlId: string): Observable<Journal> {
    return this.http.get<Journal>(`${this.apiUrl}/withJS/${jrlId}`);
  }
}
