import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, Observable, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const JwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const _authService = inject(AuthService);
  const _router = inject(Router);
  const token = _authService.getToken();

  const authReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        _authService.logout();
        _router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
}
