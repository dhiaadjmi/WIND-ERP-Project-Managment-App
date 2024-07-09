import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user-to-team-dialog-component',
  templateUrl: './add-user-to-team-dialog-component.component.html',
  styleUrls: ['./add-user-to-team-dialog-component.component.scss']
})
export class AddUserToTeamDialogComponentComponent {
  @Output() userAdded: EventEmitter<void> = new EventEmitter<void>();

  addUserToTeamForm: FormGroup;
  teamId: number;
  employees: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddUserToTeamDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private teamService: TeamService,
       private authService: AuthenticationService,
       private userService: UserService,
       private toastr: ToastrService
  ) {
    this.teamId = this.data.teamId;
    this.addUserToTeamForm = new FormGroup({

      selectedEmployees: new FormControl([], [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadTeamDetails();
    this.loadEmployees();
  }

  loadTeamDetails(): void {
    this.teamService.findTeamById(this.teamId).subscribe(
      (teamData: any) => {
        this.loadEmployees();
        this.initForm(teamData);
      },
      error => {
        console.error('Erreur lors du chargement des détails de l\'équipe :', error);
      }
    );
  }
  initForm(teamData: any): void {
    this.addUserToTeamForm.patchValue({
      selectedEmployees: this.extractEmployeeIds(teamData.users)
    });
  }
 /** loadEmployees(): void {
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
  */
  loadEmployees(): void {
    const companyIdentifier = this.authService.getUserId();
    if (companyIdentifier) {
      this.userService.getEmployeesByCompany(companyIdentifier).subscribe(
        (employees: any[]) => {
          // Filtrer les employés pour ne récupérer que ceux qui ne sont pas déjà dans l'équipe
          this.teamService.findTeamById(this.teamId).subscribe(
            (teamData: any) => {
              const employeeIdsInTeam = this.extractEmployeeIds(teamData.users);
              this.employees = employees.filter(employee => !employeeIdsInTeam.includes(employee.id));
            },
            error => {
              console.error('Erreur lors du chargement des détails de l\'équipe :', error);
            }
          );
        },
        (error) => {
          console.error('Erreur lors du chargement des employés:', error);
        }
      );
    } else {
      console.error('Identifiant de l\'entreprise non trouvé.');
    }
  }

  extractEmployeeIds(users: any[]): number[] {
    const employees = users.filter(user => user.role === 'EMPLOYEE');
    return employees.map(employee => employee.id);
  }
  onNoClick(): void {
    this.dialogRef.close(false);


  }
  /**
  addUserToTeam(teamId: number): void {
    const selectedEmployeeIds: number[] = this.addUserToTeamForm.value.selectedEmployees;
    selectedEmployeeIds.forEach(userId => {
      this.teamService.addUserToTeam(teamId, userId).subscribe(
        () => {
          Swal.fire('Succès', 'Utilisateur ajouté à l\'équipe avec succès', 'success');
        },
        error => {
          console.error('Erreur lors de l\'ajout de l\'utilisateur à l\'équipe :', error);
          Swal.fire('Erreur', 'Une erreur s\'est produite lors de l\'ajout de l\'utilisateur à l\'équipe', 'error');
        }
      );
    });
    */
    addUserToTeam(teamId: number): void {
      const selectedEmployeeId: number = this.addUserToTeamForm.value.selectedEmployees;
      this.teamService.addUserToTeam(teamId, selectedEmployeeId).subscribe(
        () => {
          this.toastr.success('Utilisateur ajouté à l\'équipe avec succès', 'Succès', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
          });

          this.loadTeamDetails();
          this.userAdded.emit();
          this.dialogRef.close();
        },
        error => {
          console.error('Erreur lors de l\'ajout de l\'utilisateur à l\'équipe :', error);
          this.toastr.error('Une erreur s\'est produite lors de l\'ajout de l\'utilisateur à l\'équipe', 'Erreur', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
          });
        }
      );
    }

    closeDialog(): void {
      this.dialogRef.close();
    }

  }



