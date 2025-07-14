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

  private _fullName = new BehaviorSubject<string | null>(null);
  fullName$ = this._fullName.asObservable();

  private _avatarUrl = new BehaviorSubject<string | null>(null);
  avatarUrl$ = this._avatarUrl.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this._fullName.next(localStorage.getItem('fullName') || null);
      this._avatarUrl.next(localStorage.getItem('avatarUrl') || null);
    }
  }
  
  login(data: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data).pipe(
      tap((res: any) => {
        if (res.statusCode != 200) {
          throw new Error(res.message || 'Login failed');
        }

        localStorage.setItem(this.tokenKey, res.token);

        // Full name
        const fullName = res.fullName || '';
        this._fullName.next(fullName);
        localStorage.setItem('fullName', fullName);

        // Avatar
        const avatarUrl = res.avatarUrl || '';
        this._avatarUrl.next(avatarUrl);
        localStorage.setItem('avatarUrl', avatarUrl);
      }
      )
    );
  }

  register(data: { fullname: string, username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('fullName');
    localStorage.removeItem('avatarUrl');
    this._fullName.next(null);
    this._avatarUrl.next(null);
  }

  googleLogin(idToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/googlelogin`, { idToken }).pipe(
      tap((res: any) => {
        if (res.statusCode != 200) {
          throw new Error(res.message || 'Google login failed');
        }

        localStorage.setItem(this.tokenKey, res.token);

        // Full name
        const fullName = res.fullName || '';
        this._fullName.next(fullName);
        localStorage.setItem('fullName', fullName);
        
        // Avatar
        const avatarUrl = res.avatarUrl || '';
        this._avatarUrl.next(avatarUrl);
        localStorage.setItem('avatarUrl', avatarUrl);
      })
    );
  }
}
