import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SprintService {

  private baseUrl = 'http://localhost:8050/sprints';
  stateUpdated: any;
  private sprintsSource = new BehaviorSubject<any[]>([]);
  currentSprints = this.sprintsSource.asObservable();

  constructor(private http: HttpClient) { }
  deleteSprint(sprintId: number): Observable<any> {
    const url = `${this.baseUrl}/${sprintId}`;
    return this.http.delete<any>(url);
  }
  getSprintById(sprintId: number): Observable<any> {
    const url = `${this.baseUrl}/${sprintId}`;
    return this.http.get<any>(url);
  }
  addSprint(newSprint: any, backlogId: number): Observable<any> {
    const url = `${this.baseUrl}/create?backlogId=${backlogId}`;
    return this.http.post<any>(url, newSprint);
  }
  getSprintsByBacklog(backlogId: number): Observable<any> {
    const url = `${this.baseUrl}/byBacklog/${backlogId}`;
    return this.http.get<any>(url);
  }
  updateSprint(sprintId: number, updatedSprint: any): Observable<any> {
    const url = `${this.baseUrl}/${sprintId}`;
    return this.http.put<any>(url, updatedSprint);
  }
  getSprintsByTaskId(taskId: number): Observable<any> {
    const url = `${this.baseUrl}/byTask/${taskId}`;
    return this.http.get<any>(url);
  }
  startSprint(sprintId: number, backlogId: number): Observable<any> {
    const url = `${this.baseUrl}/${sprintId}/start`;
    const params = { backlogId: backlogId.toString() };
    return this.http.post<any>(url, {}, {  params });
  }
  softDeleteSprint(sprintId: number): Observable<any> {
    const url = `${this.baseUrl}/${sprintId}/soft-delete`;
    return this.http.put<any>(url, {});
  }




}

