import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Brand} from '../Entities/brand/brand.module';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiUrl = 'https://localhost:7023/api/brand';

  constructor(private http: HttpClient) {}

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.apiUrl);
  }
}
