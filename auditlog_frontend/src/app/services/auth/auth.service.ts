import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private apiUrl = environment.apiUrl;

  private _currentUser = new BehaviorSubject<string | null>(null);
  currentUser$ = this._currentUser.asObservable();

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token) {
      const payload = this.decodeJwtPayload(token);
      const username = payload?.username || payload?.sub;
      this._currentUser.next(username);

      localStorage.setItem('username', username);
    }
  }
  
  login(data: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem(this.tokenKey, res.token);
        const payload = this.decodeJwtPayload(res.token);
        const username = payload?.username || payload?.sub;
        this._currentUser.next(username);
        localStorage.setItem('username', username);
      })
    );
  }

  register(data: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('username');
    this._currentUser.next(null);
  }

  private decodeJwtPayload(token: string): any {
    const payload = token.split('.')[1];
    const decoded = decodeURIComponent(
      atob(payload)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(decoded);
  }
}
