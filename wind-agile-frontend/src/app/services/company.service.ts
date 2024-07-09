import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:8060/companies';


  constructor(private http: HttpClient) {}

  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  deleteCompany(companyId: number): Observable<any> {
    const url = `${this.apiUrl}/${companyId}`;
    return this.http.delete(url);
  }
  /**
  validateCompany(companyId: number): Observable<any> {
    const url = `${this.apiUrl}/${companyId}/validate`;
    return this.http.post(url, {}, { responseType: 'text' });
  }
  */
  validateCompany(companyId: number): Observable<any> {
    const url = `${this.apiUrl}/${companyId}/validate`;
    return this.http.post(url, {}, { responseType: 'text' });
  }


  invalidateCompany(companyId: number): Observable<any> {
    const url = `${this.apiUrl}/${companyId}/invalidate`;
    return this.http.post(url, {}, { responseType: 'text' });
  }

  saveCompany(companyData: any): Observable<any> {
    const url = `${this.apiUrl}/create`;
    return this.http.post(url, companyData);
  }
  updateCompany(companyId: number, updatedCompanyData: any): Observable<any> {
    const url = `${this.apiUrl}/${companyId}`;
    return this.http.put(url, updatedCompanyData);
  }
  getCompanyDetails(companyId: number): Observable<any> {
    const url = `${this.apiUrl}/${companyId}`;
    return this.http.get<any>(url);
  }

  archiveCompany(companyId: number): Observable<any> {
    const url = `${this.apiUrl}/${companyId}/archive`;
    return this.http.post<any>(url, null);
  }
  unarchiveCompany(companyId: number): Observable<any> {
    const url = `${this.apiUrl}/${companyId}/unarchive`;
    return this.http.post<any>(url, null);
  }

  searchCompanys(query: string): Observable<any[]> {
    const params = { query: query };
    return this.http.get<any[]>(`${this.apiUrl}/search`, { params });
  }


}
