import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import Swal from 'sweetalert2';
import { TeamService } from 'src/app/services/team.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-project-dialog',
  templateUrl: './update-project-dialog.component.html',
  styleUrls: ['./update-project-dialog.component.scss']
})
export class UpdateProjectDialogComponent {

  projectForm: FormGroup;
  projectId: number;
  project: any;
  projectStates: { label: string, value: string }[] = [
    { label: 'En cours', value: 'IN_PROGRESS' },
    { label: 'Terminé', value: 'COMPLETED' },
    { label: 'En attente', value: 'ON_HOLD' },
    { label: 'Annulé', value: 'CANCELED' }
  ];
  selectedState: string | undefined;
  teams: any[] = [];
  companyIdentifier: number;


  constructor(
    public dialogRef: MatDialogRef<UpdateProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService,
    private teamService: TeamService,
    private authService: AuthenticationService,
    private toastr: ToastrService



  ) {
    this.projectId = this.data.projectId;
    this.projectForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      team: new FormControl('', [Validators.required])


    });
  }

  ngOnInit(): void {

    this.companyIdentifier = this.authService.getUserId();
    this.loadProjectDetails();
    this.getTeams();
  }



  initForm(projectData: any): void {
    this.projectForm.patchValue({
      nom: projectData.nom,
      description: projectData.description,
      state: projectData.state,
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      team: projectData.teamId
    });
  }



  selectState(state: string): void {
    this.selectedState = state;
    this.project.state = state;
  }

  getTeams(): void {
    this.teamService.findAllTeamsByCompany(this.companyIdentifier).subscribe(
      teams => {
        this.loadProjectDetails();
        this.teams = teams;
      },
      error => {
        console.error('Erreur lors de la récupération des équipes :', error);
      }
    );
}

loadProjectDetails(): void {
  this.projectService.getProjectById(this.projectId).subscribe(
    (projectData: any) => {
      console.log('Données du projet chargées avec succès :', projectData);
      this.project = projectData;
      this.initForm(projectData);
      this.filterTeams();
    },
    error => {
      console.error('Erreur lors du chargement des détails du projet :', error);
    }
  );
}

filterTeams(): void {
  this.teamService.findAllTeamsByCompany(this.companyIdentifier).subscribe(
    teams => {
      this.projectService.getAllProjects(this.companyIdentifier).subscribe(
        projects => {
          const currentTeamId = this.project.teamId;

          this.teams = teams.filter((team: { id: any; }) => {
            return !projects.some(project => project.teamId === team.id);
          });

          const currentTeam = teams.find((team: { id: any; }) => team.id === currentTeamId);
          if (currentTeam) {
            this.teams.unshift(currentTeam);
          }
        },
        error => {
          console.error('Erreur lors de la récupération des projets :', error);
        }
      );
    },
    error => {
      console.error('Erreur lors de la récupération des équipes :', error);
    }
  );
}






onUpdateClick(): void {
  if (this.projectForm.valid) {
    const updatedProjectData = this.projectForm.value;
    const teamId = updatedProjectData.team;

    Swal.fire({
      title: 'Confirmer la mise à jour',
      text: 'Êtes-vous sûr de vouloir mettre à jour ce projet ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, mettre à jour',
      confirmButtonColor: '#00095E',
      cancelButtonText: 'Annuler',
      cancelButtonColor: '#facc15',
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.updateProject(this.projectId, updatedProjectData, teamId).subscribe(
          () => {
            this.toastr.success('Le projet a été mis à jour avec succès', 'Mise à jour réussie', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              progressBar: true
            });

            this.loadProjectDetails();
            this.dialogRef.close(true);
          },
          error => {
            console.error('Erreur lors de la mise à jour du projet :', error);
            this.toastr.error('Une erreur s\'est produite lors de la mise à jour du projet', 'Erreur', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              progressBar: true
            });
          }
        );
      }
    });
  }
}



  onNoClick(): void {
    this.dialogRef.close(false);
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
