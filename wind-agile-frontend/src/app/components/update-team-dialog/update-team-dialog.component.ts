import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TeamService } from '../../services/team.service';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-update-team-dialog',
  templateUrl: './update-team-dialog.component.html',
  styleUrls: ['./update-team-dialog.component.scss']
})
export class UpdateTeamDialogComponent {
  @Output() teamUpdated: EventEmitter<any> = new EventEmitter();

  teamForm: FormGroup;
  teamId: number;
  teamName: string = '';
  leaders: any[] = [];
  employees: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<UpdateTeamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private teamService: TeamService,
       private authService: AuthenticationService,
       private userService: UserService,
       private toastr: ToastrService


  ) {
    this.teamId = this.data.teamId;
    this.teamForm = new FormGroup({
      teamName: new FormControl('', [Validators.required]),
      selectedLeader: new FormControl('', [Validators.required]),
      selectedEmployees: new FormControl([], [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadTeamDetails();
    this.loadLeaders();
    this.loadEmployees();
  }
  loadTeamDetails(): void {
    this.teamService.findTeamById(this.teamId).subscribe(
      (teamData: any) => {
        this.teamName = teamData.name;
        this.loadLeaders();
        this.loadEmployees();
        this.initForm(teamData);
      },
      error => {
        console.error('Erreur lors du chargement des détails de l\'équipe :', error);
      }
    );
  }

/**
  initForm(teamData: any): void {
    this.teamForm.patchValue({
      teamName: teamData.name,
      selectedLeader: teamData.leaderId,
      selectedEmployees: teamData.employeeIds
    });
  }
  */
  initForm(teamData: any): void {
    this.teamForm.patchValue({
      teamName: teamData.name,
      selectedLeader: this.extractLeaderId(teamData.users),
      selectedEmployees: this.extractEmployeeIds(teamData.users)
    });
  }
  extractLeaderId(users: any[]): number {
    const leader = users.find(user => user.role === 'LEADER');
    return leader ? leader.id : null;
  }

  extractEmployeeIds(users: any[]): number[] {
    const employees = users.filter(user => user.role === 'EMPLOYEE');
    return employees.map(employee => employee.id);
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
  loadLeaders(): void {
    const companyIdentifier = this.authService.getUserId();
    if (companyIdentifier) {
      this.userService.getLeadersByCompany(companyIdentifier).subscribe(
        (leaders: any[]) => {
          this.leaders = leaders;
        },
        (error) => {
          console.error('Erreur lors du chargement des leaders:', error);
        }
      );
    } else {
      console.error('Identifiant de l\'entreprise non trouvé.');
    }
  }

  loadEmployees(): void {
    const companyIdentifier = this.authService.getUserId();
    if (companyIdentifier) {
      this.userService.getEmployeesByCompany(companyIdentifier).subscribe(
        (employees: any[]) => {
          this.employees = employees;
        },
        (error) => {
          console.error('Erreur lors du chargement des employés:', error);
        }
      );
    } else {
      console.error('Identifiant de l\'entreprise non trouvé.');
    }
  }

  onUpdateClick(): void {
    if (this.teamForm.valid) {
      const selectedLeaderId: number = this.teamForm.value.selectedLeader;
      const selectedEmployeeIds: number[] = this.teamForm.value.selectedEmployees;

      const updatedTeamData = {
        name: this.teamForm.value.teamName,
        users: [
          { id: selectedLeaderId },
          ...selectedEmployeeIds.map((id: number) => ({ id }))
        ]
      };

      Swal.fire({
        title: 'Confirmer la mise à jour',
        text: 'Êtes-vous sûr de vouloir mettre à jour cette équipe ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui, mettre à jour',
        confirmButtonColor: '#00095E',
        cancelButtonText: 'Annuler',
        cancelButtonColor: '#facc15'
      }).then((result) => {
        if (result.isConfirmed) {
          this.teamService.updateTeam(this.teamId, updatedTeamData).subscribe(
            () => {
              this.toastr.success('L\'équipe a été mise à jour avec succès', 'Mise à jour réussie', {
                timeOut: 3000,
                positionClass: 'toast-top-right',
                progressBar: true
              });
              this.teamUpdated.emit();

              this.dialogRef.close(true);
            },
            error => {
              console.error('Erreur lors de la mise à jour de l\'équipe :', error);
              this.toastr.error('Une erreur s\'est produite lors de la mise à jour de l\'équipe', 'Erreur', {
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


}

