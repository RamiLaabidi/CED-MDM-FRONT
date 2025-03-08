import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {JournalSetting} from '../Entities/journal-setting/journal-setting.module';

@Injectable({
  providedIn: 'root'
})
export class JournalSettingService {
  private apiUrl = 'https://localhost:7023/api/JournalSettingType';
  private baseUrl = 'https://localhost:7023/api/JournalSetting';

  constructor(private http: HttpClient) {}

  getAvailableJournalSettingTypes(legalEntityId: string, entrySystem: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/available?legalEntityId=${legalEntityId}&entrySystem=${entrySystem}`);
  }
  createJournalSetting(journalSetting: JournalSetting): Observable<JournalSetting> {
    return this.http.post<JournalSetting>(`${this.baseUrl}/create`, journalSetting);
  }
}
