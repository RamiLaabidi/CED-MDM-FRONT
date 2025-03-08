import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JournalSettingService {
  private apiUrl = 'https://localhost:7023/api/JournalSettingType';

  constructor(private http: HttpClient) {}

  getAvailableJournalSettingTypes(legalEntityId: string, entrySystem: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/available?legalEntityId=${legalEntityId}&entrySystem=${entrySystem}`);
  }
}
