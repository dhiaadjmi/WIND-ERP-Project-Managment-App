import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8060/users';

  constructor(private http: HttpClient) { }
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  deleteUser(userId: number): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.delete(url);
  }
  saveUser(userData: any): Observable<any> {
    const url = `${this.apiUrl}/create`;
    return this.http.post(url, userData);
  }
  updateUser(userId: number, updatedUserData: any): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.put(url, updatedUserData);
  }
  getUserDetails(userId: number): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get<any>(url);
  }

  getAllUsersByCompany(companyIdentifier: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usersbycompany?companyIdentifier=${companyIdentifier}`);
  }

  addUser(userData: any, companyIdentifier: Number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let params = new HttpParams().set('companyIdentifier', companyIdentifier.toString());

    return this.http.post<any>(`${this.apiUrl}/create`, userData, {headers, params });
  }

 archiveUser(userId: number): Observable<any> {
    const url = `${this.apiUrl}/${userId}/archive`;
    return this.http.post<any>(url, null);
  }
  unarchiveUser(userId: number): Observable<any> {
    const url = `${this.apiUrl}/${userId}/unarchive`;
    return this.http.post<any>(url, null);
  }
  getLeadersByCompany(companyIdentifier: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leaders?companyIdentifier=${companyIdentifier}`);
  }

  getEmployeesByCompany(companyIdentifier: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employees?companyIdentifier=${companyIdentifier}`);
  }
  searchUsers(query: string): Observable<any[]> {
    const params = { query: query };
    return this.http.get<any[]>(`${this.apiUrl}/search`, { params });
  }
}

