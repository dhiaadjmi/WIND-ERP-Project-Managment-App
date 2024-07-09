import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private _authenticated: boolean = false;
  private isEmailVerified = false;
  private readonly TOKEN_KEY = 'accessToken';
  private readonly USER_ID_KEY = 'userId';
  private readonly USER_ROLE = 'role';
  private readonly CompanyIdentifier = 'companyIdentifier'
  private baseUrl = 'http://localhost:8060/users';
  private profileImageUrlSubject: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);



  constructor(private http: HttpClient,private router: Router) {}

  signIn(credentials: { email: string; password: string }): Observable<any> {


    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<{ token: string ,userId:any,role:any,companyIdentifier:any,user: any}>('http://localhost:8060/auth/login', credentials).pipe(
      map((response) => {
        localStorage.setItem('accessToken', response.token);
        localStorage.setItem(this.USER_ID_KEY, response.userId);
        localStorage.setItem(this.USER_ROLE, response.role);
        localStorage.setItem(this.CompanyIdentifier, response.companyIdentifier);

        console.log('JWT Token:', response.token);

        this._authenticated = true;
        return response;
      }),
      catchError((error) => {
        console.error('Login error', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  logout(): void {
    localStorage.clear();




    this.router.navigate(['/authentication/login']);
}


verifyEmail(email: string, token: string): Observable<any> {
  const verificationUrl = `http://localhost:8060/companies/verify-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
  return this.http.get(verificationUrl);
}

getIsEmailVerified(): boolean {
  return this.isEmailVerified;
}

getToken(): string | null {
  return localStorage.getItem(this.TOKEN_KEY);
}
getUserId(): any | null {
  return localStorage.getItem(this.USER_ID_KEY);
}
getRole(): any | null {
  return localStorage.getItem(this.USER_ROLE);
}
getCompanyIdentifier(): any | null {
  return localStorage.getItem(this.CompanyIdentifier);
}
/**
getProfileImageUrl(userId: number): Observable<string> {
  return this.http.get<string>(`${this.apiUrl}/${userId}/profileImageUrl`);
}

*/
getProfileImageUrl(userId: number): Observable<string> {
  const url = `${this.baseUrl}/${userId}/profileImageUrl`;
  return this.http.get(url, { responseType: 'text' });
}
uploadProfileImage(file: File, userId: number) {
  const formData: FormData = new FormData();
  formData.append('file', file, file.name);
  formData.append('userId', userId.toString());

  return this.http.post<any>(`http://localhost:8060/users/uploadProfileImage`, formData);
}
/**
resetPassword(email: string): Observable<any> {
  const resetPasswordUrl = `http://localhost:8060/companies/resetPassword`;
  return this.http.post(resetPasswordUrl, null, { params: { email } }).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        return throwError('Failed to connect to the server. Please check your internet connection.');
      } else {
        return throwError(error.error.message || 'An error occurred while resetting the password.');
      }
    })
  );
}
*/
resetPassword(email: string): Observable<any> {
  const resetPasswordUrl = `http://localhost:8060/companies/resetPassword`;
  return this.http.post(resetPasswordUrl, null, { params: { email } }).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred while resetting the password.';
      if (error.status === 0) {
        errorMessage = 'Failed to connect to the server. Please check your internet connection.';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
      return throwError(errorMessage);
    })
  );
}

updateProfileImageUrl(url: string): void {
  this.profileImageUrlSubject.next(url);
}


}
