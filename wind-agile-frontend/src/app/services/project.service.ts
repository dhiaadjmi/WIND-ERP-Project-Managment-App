import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = 'http://localhost:8050/projects';

  constructor(private http: HttpClient) { }

  /**getProjectsByTeamId(teamId: number): Observable<any[]> {
    const url = `${this.baseUrl}/team/${teamId}`;
    return this.http.get<any[]>(url);
  }
  */
  getProjectByTeamId(teamId: number): Observable<any> {
    const url = `${this.baseUrl}/team/${teamId}`;
    return this.http.get<any>(url);
  }

  getAllProjects(companyIdentifier: number): Observable<any[]> {
    const url = `${this.baseUrl}`;
    const params = new HttpParams().set('companyIdentifier', companyIdentifier.toString());

    return this.http.get<any[]>(url, { params });
  }


  /**addProject(project: any): Observable<any> {
    const url = `${this.baseUrl}/create`;
    return this.http.post<any>(url, project);
  }*/
  /**
  addProject(project: any, teamId: number): Observable<any> {
    const url = `${this.baseUrl}/create`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const params = new HttpParams().set('teamId', teamId.toString());

    return this.http.post<any>(url, project, { headers, params });
  }
*/


addProject(project: any, teamId: number, companyIdentifier: number): Observable<any> {
  const url = `${this.baseUrl}/create`;

  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  const params = new HttpParams()
    .set('teamId', teamId.toString())
    .set('companyIdentifier', companyIdentifier.toString());

  return this.http.post<any>(url, project, { headers, params });
}








  /**
  updateProject(projectId: number, updatedProject: any): Observable<any> {
    const url = `${this.baseUrl}/${projectId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<any>(url, updatedProject, { headers });
  }
  */
  updateProject(projectId: number, updatedProject: any, teamId: number): Observable<any> {
    const url = `${this.baseUrl}/${projectId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const params = new HttpParams().set('teamId', teamId.toString());

    return this.http.put<any>(url, updatedProject, { headers, params });
}


  getProjectById(projectId: number): Observable<any> {
    const url = `${this.baseUrl}/${projectId}`;
    return this.http.get<any>(url);
  }
  deleteProject(projectId: number): Observable<any> {
    const url = `${this.baseUrl}/${projectId}`;
    return this.http.delete<any>(url);
  }
  softDeleteProject(projectId: number): Observable<any> {
    const url = `${this.baseUrl}/${projectId}/soft-delete`;
    return this.http.put<any>(url, {});
  }
  searchProjects(keyword: string): Observable<any[]> {
    const url = `${this.baseUrl}/search`;
    const params = new HttpParams().set('query', keyword);

    return this.http.get<any[]>(url, { params });
  }
}
