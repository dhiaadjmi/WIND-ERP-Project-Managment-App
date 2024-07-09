import { Component } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { TeamService } from 'src/app/services/team.service';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent {
  project: any = {};
  teamId: number;
  teams: any[] = [];
  selectedTeamId: number | undefined;
  companyIdentifier: number;


  projectStates: { label: string, value: string }[] = [
    { label: 'En cours', value: 'IN_PROGRESS' },
    { label: 'Terminé', value: 'COMPLETED' },
    { label: 'En attente', value: 'ON_HOLD' },
    { label: 'Annulé', value: 'CANCELED' }
  ];
  selectedState: string | undefined;


  constructor(private projectService: ProjectService,
    private teamService: TeamService,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.companyIdentifier = this.authService.getUserId();

    this.loadTeams();
  }
  selectState(state: string): void {
    this.selectedState = state;
    this.project.state = state;
  }

  loadTeams(): void {
    this.teamService.findAllTeamsByCompany(this.companyIdentifier).subscribe(
      teams => {
        this.filterTeams(teams);
      },
      error => {
        console.error('Erreur lors de la récupération des équipes :', error);
      }
    );
  }

  filterTeams(teams: any[]): void {
    this.projectService.getAllProjects(this.companyIdentifier).subscribe(
      projects => {
        this.teams = teams.filter(team => {
          return !projects.some(project => project.teamId === team.id);
        });
      },
      error => {
        console.error('Erreur lors de la récupération des projets :', error);
      }
    );
  }



  addProject(): void {
    if (!this.selectedTeamId || !this.companyIdentifier) {
      console.error('Veuillez sélectionner une équipe et spécifier un identifiant de société.');
      return;
    }

    this.projectService.addProject(this.project, this.selectedTeamId, this.companyIdentifier).subscribe(() => {
      console.log('Projet ajouté avec succès !');
      this.project = {};
      this.toastr.success('Le projet a été ajouté avec succès.', 'Succès', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true,
      });
      this.router.navigate(['/component/projects']);

    }, error => {
      console.error('Erreur lors de l\'ajout du projet :', error);
      this.toastr.error('Une erreur est survenue lors de l\'ajout du projet.', 'Erreur', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true,
      });
    });
  }



}
