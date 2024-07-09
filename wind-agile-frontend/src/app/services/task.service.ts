import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl = 'http://localhost:8050/tasks';

  constructor(private http: HttpClient) { }

  getTaskById(taskId: number): Observable<any> {
    const url = `${this.baseUrl}/${taskId}`;
    return this.http.get<any>(url);
  }
  createTaskInSprint(newTask: any, sprintId: number, backlogId: number, userId: number): Observable<any> {
    const url = `${this.baseUrl}/createInSprint/${sprintId}/${backlogId}/${userId}`;
    return this.http.post<any>(url, newTask);
  }
  createTaskInBacklog(newTask: any, backlogId: number): Observable<any> {
    const url = `${this.baseUrl}/create/${backlogId}`;
    return this.http.post<any>(url, newTask);
  }
  updateTask(taskId: number, updatedTask: any): Observable<any> {
    const url = `${this.baseUrl}/${taskId}`;
    return this.http.put<any>(url, updatedTask);
  }
  getTaskByUserId(userId: number): Observable<any> {
    const url = `${this.baseUrl}/user/${userId}`;
    return this.http.get<any>(url);
  }
  associateTaskWithSprint(taskId: number, sprintId: number, backlogId: number): Observable<any> {
    const url = `${this.baseUrl}/${taskId}/associateWithSprint/${sprintId}/${backlogId}`;
    return this.http.post<any>(url, {});
  }
  assignTaskToUser(taskId: number, userId: number): Observable<any> {
    const url = `${this.baseUrl}/${taskId}/assignUser/${userId}`;
    return this.http.put<any>(url, {});
  }

  uploadTaskImages(taskId: number, formData: FormData): Observable<any> {
    const url = `${this.baseUrl}/${taskId}/uploadTaskImage`;
    return this.http.post<any>(url, formData);
  }
  updateTaskState(taskId: number, updatedTaskState: any): Observable<any> {
    const url = `${this.baseUrl}/${taskId}/state`;
    return this.http.put<any>(url, updatedTaskState);
  }
  getTasksBySprintId(sprintId: number): Observable<any> {
    const url = `${this.baseUrl}/by-sprint/${sprintId}`;
    return this.http.get<any>(url);
  }
  softDeleteTask(taskId: number): Observable<any> {
    const url = `${this.baseUrl}/${taskId}/soft-delete`;
    return this.http.put<any>(url, {});
  }
  getTasksByUserIdAndProjectId(projectId: number,userId: number ): Observable<any> {
    const url = `${this.baseUrl}/by-project-and-user/${projectId}/${userId}`;
    return this.http.get<any>(url);
  }

}
