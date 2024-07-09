import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'http://localhost:8060/teams';

  constructor(private http: HttpClient) { }

  addTeam(teamData: any,companyIdentifier: Number): Observable<any> {
    const url = `${this.apiUrl}/create`;
    return this.http.post(url, teamData);
  }

  createTeamWithUsers(teamData: any, companyIdentifier: Number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let params = new HttpParams().set('companyIdentifier', companyIdentifier.toString());

    const url = `${this.apiUrl}/createteam`
    return this.http.post(url, teamData, {headers, params });
  }
  /**
  findAllTeams(): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.get<any[]>(url);
  }*/
  findAllTeamsByCompany(companyIdentifier: Number): Observable<any> {
    let params = new HttpParams().set('companyIdentifier', companyIdentifier.toString());
    const url = `${this.apiUrl}/bycompany`;
    return this.http.get<any[]>(url,{params});
  }
  findTeamById(teamId: number): Observable<any> {
    const url = `${this.apiUrl}/${teamId}`;
    return this.http.get<any>(url);
  }

  updateTeam(teamId: number, updatedTeamData: any): Observable<any> {
    const url = `${this.apiUrl}/${teamId}`;
    return this.http.put(url, updatedTeamData);
  }

  removeUserFromTeam(teamId: number, userId: number): Observable<any> {
    const url = `${this.apiUrl}/${teamId}/removeUser/${userId}`;
    return this.http.post(url, null);
  }
  addUserToTeam(teamId: number, userId: number): Observable<any> {

    const url = `${this.apiUrl}/${teamId}/add/${userId}`;


    return this.http.post(url, null);
  }
  deleteTeam(teamId: number): Observable<any> {
    const url = `${this.apiUrl}/${teamId}`;
    return this.http.delete(url);
  }
  softDeleteTeam(teamId: number): Observable<any> {
    const url = `${this.apiUrl}/${teamId}/soft-delete`;
    return this.http.put(url, null);
  }

  recoverTeam(teamId: number): Observable<any> {
    const url = `${this.apiUrl}/${teamId}/recover`;
    return this.http.put(url, null);
  }


}
