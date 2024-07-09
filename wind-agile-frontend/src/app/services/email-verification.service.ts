import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailVerificationService {
  private apiUrl = 'http://localhost:8060/companies';

  constructor(private http: HttpClient) { }

  checkEmailExists(email: string) {
    return this.http.get<boolean>(`${this.apiUrl}/check-email?email=${email}`);
  }
}
