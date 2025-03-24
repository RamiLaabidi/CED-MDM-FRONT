import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {JournalSetting} from '../Entities/journal-setting/journal-setting.module';
import {Journal} from '../Entities/journal/journal.module';

@Injectable({
  providedIn: 'root'
})
export class JournalSettingService {
  private apiUrl = 'https://localhost:7023/api/JournalSettingType';
  private baseUrl = 'https://localhost:7023/api/JournalSetting';
  private naveUrl = 'https://localhost:7023/api/journal';

  private formData: any = null;

  constructor(private http: HttpClient) {}

  getAvailableJournalSettingTypes(legalEntityId: string, entrySystem: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/available?legalEntityId=${legalEntityId}&entrySystem=${entrySystem}`);
  }
  createJournalSetting(journalSetting: JournalSetting): Observable<JournalSetting> {
    return this.http.post<JournalSetting>(`${this.baseUrl}/create`, journalSetting);
  }

  getJournalByIdWithSettings(jrlId: string): Observable<Journal> {
    return this.http.get<Journal>(`${this.naveUrl}/withJS/${jrlId}`);
  }
  saveFormData(data: any) {
    this.formData = data;
  }

  getFormData(): any {
    return this.formData;
  }
  getAll(): Observable<JournalSetting[]> {
    return this.http.get<JournalSetting[]>(this.baseUrl);
  }

  getById(jlsId: string): Observable<JournalSetting> {
    return this.http.get<JournalSetting>(`${this.baseUrl}/${jlsId}`);
  }

  update(jlsId: string, updatedJournalSetting: JournalSetting): Observable<JournalSetting> {
    return this.http.put<JournalSetting>(`${this.baseUrl}/${jlsId}`, updatedJournalSetting);
  }
}
