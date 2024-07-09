import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectService } from '../../services/project.service';
import { TeamService } from '../../services/team.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProjectDialogComponent } from '../update-project-dialog/update-project-dialog.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of, tap } from 'rxjs';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  projectStates: { label: string, value: string }[] = [];
  displayedColumns: string[] = ['nom', 'startDate', 'endDate', 'teamName', 'profileImage', 'state', 'actions'];
  companyIdentifier: number;
  userRole: any;
  searchTerm: string = '';
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private projectService: ProjectService,
    private teamService: TeamService,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
    this.companyIdentifier = this.authService.getUserId();
    this.getAllProjects();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllProjects(): void {
    this.projectService.getAllProjects(this.companyIdentifier).subscribe(projects => {
      this.projects = projects;
      this.loadTeamsData();
    });
  }

  loadTeamsData(): void {
    const observables = this.projects.map(project => {
      if (project.teamId) {
        return this.teamService.findTeamById(project.teamId).pipe(
          tap((team: any) => {
            project.team = team;
            project.teamName = team.name;
            this.loadUserProfileImages(project.team.users);
          })
        );
      } else {
        return of(null);
      }
    });

    forkJoin(observables).subscribe(() => {
      this.dataSource.data = this.projects;
      this.translateProjectStates();
    });
  }

  loadUserProfileImages(users: any[]): void {
    users.forEach(user => {
      if (user.profileImageUrl) {
        user.profileImageUrl = 'http://localhost:8060/images/' + user.profileImageUrl;
      }
    });
  }

  openUserDetails(user: any): void {
    this.dialog.open(UserDetailsComponent, {
      width: '600px',
     // position: { right: '290px' },
      data: user
    });
  }

  openUpdateProjectDialog(projectId: number): void {
    const dialogRef = this.dialog.open(UpdateProjectDialogComponent, {
      width: '900px',
     // position: { right: '120px' },
      data: { projectId: projectId }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllProjects();
    });
  }

  deleteProject(projectId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Voulez-vous vraiment supprimer ce projet?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.projectService.softDeleteProject(projectId).subscribe(
          () => {
            this.toastr.success('Le projet a été supprimé avec succès.', 'Supprimé!', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              progressBar: true,
            });
            this.getAllProjects();
          },
          error => {
            this.toastr.error('Une erreur est survenue lors de la suppression du projet.', 'Erreur!', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              progressBar: true,
            });
          }
        );
      }
    });
  }

  viewProjectDetails(projectId: number): void {
    this.router.navigate(['/component/projectdetails/', projectId]);
  }

  searchProjects(): void {
    if (this.searchTerm.trim() !== '') {
      this.projectService.searchProjects(this.searchTerm).subscribe(data => {
        if (data.length === 0) {
          this.dataSource.data = [];
        } else {
          const observables = data.map(project => {
            if (project.teamId) {
              return this.teamService.findTeamById(project.teamId);
            } else {
              return of(null);
            }
          });

          forkJoin(observables).subscribe(teams => {
            const updatedData = data.map((project, index) => {
              if (teams[index]) {
                project.teamName = teams[index].name;
                this.loadUserProfileImages(teams[index].users);
                project.team = teams[index];
              }
              return project;
            });

            this.dataSource.data = updatedData;
            this.translateProjectStates();
          });
        }
      }, error => {
        console.error('Erreur lors de la récupération des projets :', error);
      });
    } else {
      this.getAllProjects();
    }
  }

  translateProjectStates(): void {
    const projectStates = [
      { label: 'En cours', value: 'IN_PROGRESS' },
      { label: 'Terminé', value: 'COMPLETED' },
      { label: 'En attente', value: 'ON_HOLD' },
      { label: 'Annulé', value: 'CANCELED' }
    ];

    this.dataSource.data.forEach(project => {
      const translatedState = projectStates.find(state => state.value === project.state);
      if (translatedState) {
        project.state = translatedState.label;
      }
    });
  }
}
