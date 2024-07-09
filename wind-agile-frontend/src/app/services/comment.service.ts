import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentService {



  private baseUrl = 'http://localhost:8050/comments';

  commentAdded: EventEmitter<any> = new EventEmitter();


  constructor(private http: HttpClient) { }

  saveComment(commentData: any, taskId: number, userId: number): Observable<any> {
    const url = `${this.baseUrl}/create?taskId=${taskId}&userId=${userId}`;
    return this.http.post<any>(url, commentData);
  }


  findAllComments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }
  findCommentsByTask(taskId:number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/task/${taskId}`);
  }

  findCommentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
  deleteComment(commentId: number): Observable<void> {
    const url = `${this.baseUrl}/${commentId}`;
    return this.http.delete<void>(url);
  }
}



