import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BacklogService {

  private baseUrl = 'http://localhost:8050/backlogs';

  constructor(private http: HttpClient) { }
  deleteProject(backlogId: number): Observable<any> {
    const url = `${this.baseUrl}/${backlogId}`;
    return this.http.delete<any>(url);
  }

  getBacklogById(backlogId: number): Observable<any> {
    const url = `${this.baseUrl}/${backlogId}`;
    return this.http.get<any>(url);
  }

  updateBacklog(backlogId: number, updatedBacklog: any): Observable<any> {
    const url = `${this.baseUrl}/${backlogId}`;
    return this.http.put<any>(url, updatedBacklog);
  }
  createBacklog(projectId: number, backlogData: any): Observable<any> {
    const url = `${this.baseUrl}/create/${projectId}`;
    return this.http.post<any>(url, backlogData);
  }
}

