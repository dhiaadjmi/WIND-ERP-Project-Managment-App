import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { TeamService } from '../../services/team.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable, forkJoin } from 'rxjs';
import{} from '../tasks/tasks.component'
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SprintService } from 'src/app/services/sprint.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project: any;
  backlogId: any;
  teamId:number;
  projectStates: { label: string, value: string }[] = [];
  team: any;
  teamMembers: any[] = [];
  projectBacklog: any;
  projectSprints: any;
  projectTasks: any;
  projectId: number;
  showTeamsHeader: boolean;
  userRole: any;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private teamService: TeamService,
    private authService: AuthenticationService,
    private sprintService: SprintService,
    private location: Location,

    private router: Router

  ) { }

  ngOnInit(): void {

    this.userRole = this.authService.getRole();

    this.projectId = +this.route.snapshot.params['id'];
    this.getProjectById(this.projectId);

  }

  getProjectById(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe(project => {
      this.project = project;
      this.translateProjectStates();
      if (this.project.teamId) {
        this.getTeamInfo(this.project.teamId);
        this.teamId = this.project.teamId;

      }
      this.projectBacklog = project.backlog;
      this.backlogId = project.backlog.id;

     this.projectSprints = project.backlog.sprints;
      this.projectTasks = [];
      /**
 this.projectSprints.forEach((sprint: any) => {
  if (sprint.defaultSprint) {
    this.projectTasks = sprint.tasks;
    return;
  }
});
*/
      console.log(this.projectBacklog)

    });
  }




  getTeamInfo(teamId: number): void {
    this.teamService.findTeamById(teamId).subscribe(team => {
      this.team = team;
      if (this.team) {
        const userIds = this.team.users.map((user: { id: any; }) => user.id);
        this.loadUserProfileImages(userIds);
      }
    });
  }

  loadUserProfileImages(userIds: number[]): void {
    const observables: Observable<string>[] = [];

    userIds.forEach((userId: number) => {
      observables.push(this.authService.getProfileImageUrl(userId));
    });

    forkJoin(observables).subscribe(
      (imageUrls: string[]) => {
        this.team.users.forEach((user: any, index: number) => {
          user.profileImageUrl = imageUrls[index];
        });
      },
      (error) => {
        console.error('Error fetching profile images:', error);
      }
    );
  }





  translateProjectStates(): void {
    this.projectStates = [
      { label: 'En cours', value: 'IN_PROGRESS' },
      { label: 'Terminé', value: 'COMPLETED' },
      { label: 'En attente', value: 'ON_HOLD' },
      { label: 'Annulé', value: 'CANCELED' }
    ];

    const translatedState = this.projectStates.find(state => state.value === this.project.state);
    if (translatedState) {
      this.project.state = translatedState.label;
    }
  }
  navigateToTeams() {
    this.router.navigate(['/component/myteams']);
  }
  navigateToProjects() {
    this.router.navigate(['/component/projects']);
  }
  goBack() {
    this.location.back();
  }
}
