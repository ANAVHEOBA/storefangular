import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, ApiError } from './types';

@Injectable({
  providedIn: 'root'
})
export class LoginApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Login user with email and password
   * @param data LoginRequest data containing email and password
   * @returns Observable of LoginResponse
   */
  login(data: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, data, { headers })
      .pipe(
        tap(response => {
          if (response.success) {
            // Store the token in localStorage
            localStorage.setItem('token', response.token);
            // Store user info
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Check if user is logged in
   * @returns boolean
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Get current user
   * @returns User object or null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get auth token
   * @returns string or null
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Handles API errors
   * @param error HttpErrorResponse
   * @returns Observable error
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}`;
    }

    return throwError(() => ({
      success: false,
      message: errorMessage
    } as ApiError));
  }
} 