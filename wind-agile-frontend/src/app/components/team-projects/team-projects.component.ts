import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { TeamService } from 'src/app/services/team.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-team-projects',
  templateUrl: './team-projects.component.html',
  styleUrls: ['./team-projects.component.scss']
})
export class TeamProjectsComponent implements OnInit {
  project: any;
  teamId: number;
  displayedColumns: string[] = ['nom', 'startDate', 'endDate', 'teamName', 'profileImage', 'state', 'actions'];
  team: any;
  constructor(
    private projectService: ProjectService,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.teamId = Number(params.get('id'));
      this.fetchTeamProject();
    });
  }
/**
  fetchTeamProjects(): void {
    this.projectService.getProjectsByTeamId(this.teamId).subscribe(
      (projects) => {
        this.projects = projects;
        this.projects.forEach(project => {
          this.getTeamName(project);
          if (project.teamId) {
            this.getTeamInfo(project.teamId);
          }
          this.translateProjectStates(project);
        });
      },
      (error) => {
        console.error('Error fetching team projects:', error);
      }
    );
  }

  */
  fetchTeamProject(): void {
    this.projectService.getProjectByTeamId(this.teamId).subscribe(
      (project) => {
        this.project = project;
        this.getTeamName(project);
        if (project.teamId) {
          this.getTeamInfo(project.teamId);
        }
        this.translateProjectStates(project);
      },
      (error) => {
        console.error('Error fetching team projects:', error);
      }
    );
  }



  getTeamName(project: any): void {
    if (project.teamId) {
      this.teamService.findTeamById(project.teamId).subscribe(team => {
        console.log('Team:', team);
        project.teamName = team.name;
      });
    }
  }

  getTeamInfo(teamId: number): void {
    this.teamService.findTeamById(teamId).subscribe(team => {
      this.team = team;

      console.log('Team:', team);
      if (team) {
        this.loadUserProfileImages(team.users);
      }
    });
  }
  loadUserProfileImages(users: any[]): void {
    console.log('Users:', users);
    users.forEach((user: any) => {
      if (user.profileImageUrl) {
        user.profileImageUrl = 'http://localhost:8060/images/' + user.profileImageUrl;
      }
      console.log('User with profile image:', user);
      console.log('Firstname:', user.firstname); // Ajout du prénom
    });
  }








  translateProjectStates(project: any): void {
    const projectStates = [
      { label: 'En cours', value: 'IN_PROGRESS' },
      { label: 'Terminé', value: 'COMPLETED' },
      { label: 'En attente', value: 'ON_HOLD' },
      { label: 'Annulé', value: 'CANCELED' }
    ];

    const translatedState = projectStates.find(state => state.value === project.state);
    if (translatedState) {
      project.state = translatedState.label;
    }
  }

  viewProjectDetails(projectId: number): void {
    this.router.navigate(['/component/projectdetails/', projectId]);
  }

  openUserDetails(user: any): void {
    this.dialog.open(UserDetailsComponent, {
      width: '600px',
      position: { right: '290px' },
      data: user
    });
  }

  navigateToTeams() {
    this.router.navigate(['/component/myteams']);
  }
  goBack() {
    this.location.back();
  }
}
