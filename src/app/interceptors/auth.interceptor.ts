import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Clone request and add authorization header if token exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Ensure Content-Type is set for JSON requests
  if (!authReq.headers.has('Content-Type') && !(authReq.body instanceof FormData)) {
    authReq = authReq.clone({
      setHeaders: {
        'Content-Type': 'application/json'
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('Authentication error: Token expired or invalid');
        authService.logout();
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.url, expired: 'true' }
        });
      } else if (error.status === 403) {
        console.error('Authorization error: Insufficient permissions');
        alert('You do not have permission to perform this action');
      } else if (error.status === 0) {
        console.error('Network error: Could not connect to server');
      }

      return throwError(() => error);
    })
  );
};
