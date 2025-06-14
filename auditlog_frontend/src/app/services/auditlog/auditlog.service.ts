import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAuditLogs(search: string = '', page: number = 1, pageSize: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('search', search)
      .set('page', page)
      .set('pageSize', pageSize);
      return this.http.get(`${this.apiUrl}/AuditLog/get`, { params });
  }
}
