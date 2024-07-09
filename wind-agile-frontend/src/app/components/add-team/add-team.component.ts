import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeamService } from '../../services/team.service';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';



@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss']
})
export class AddTeamComponent implements OnInit {
  teamForm: FormGroup;
  leaders: any[] = [];
  employees: any[] = [];
  companyIdentifier: Number;


  constructor(private teamService: TeamService,
    private userService: UserService,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.companyIdentifier = this.authService.getUserId();
    this.initForm();
    this.loadLeaders();
    this.loadEmployees();
  }

  initForm(): void {
    this.teamForm = new FormGroup({
      teamName: new FormControl('', [Validators.required]),
      selectedLeader: new FormControl('', [Validators.required]),
      selectedEmployees: new FormControl('', [Validators.required])
    });
  }

  loadLeaders(): void {
    const companyIdentifier = this.authService.getUserId();
    if (companyIdentifier) {
      this.userService.getLeadersByCompany(companyIdentifier).subscribe(
        (leaders: any[]) => {
          this.leaders = leaders;
          console.log(this.leaders)
        },
        (error) => {
          console.error('Error fetching leaders:', error);
        }
      );
    } else {
      console.error('Company identifier not found.');
    }
  }

  loadEmployees(): void {
    const companyIdentifier = this.authService.getUserId();
    if (companyIdentifier) {
      this.userService.getEmployeesByCompany(companyIdentifier).subscribe(
        (employees: any[]) => {
          this.employees = employees;
          console.log( this.employees)
        },
        (error) => {
          console.error('Error fetching employees:', error);
        }
      );
    } else {
      console.error('Company identifier not found.');
    }
  }


  addTeam(): void {
    if (this.teamForm.valid) {
      const selectedLeaderId: number = this.teamForm.value.selectedLeader;
      const selectedEmployeeIds: number[] = this.teamForm.value.selectedEmployees;

      const users = [
        { id: selectedLeaderId },
        ...selectedEmployeeIds.map((id: number) => ({ id }))
      ];

      const teamData = {
        name: this.teamForm.value.teamName,
        users: users
      };

      console.log('Données de l\'équipe à envoyer au serveur :', teamData);

      if (this.companyIdentifier !== undefined) {
        this.teamService.createTeamWithUsers(teamData, this.companyIdentifier).subscribe(
          () => {
            this.toastr.success('Équipe ajoutée avec succès!', 'Succès', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              progressBar: true,
            });
            this.teamForm.reset();
            this.router.navigate(['/component/teams']);

          },
          (error) => {
            console.error('Erreur lors de l\'ajout de l\'équipe:', error);
            this.toastr.error('Une erreur s\'est produite lors de l\'ajout de l\'équipe.', 'Erreur', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              progressBar: true,
            });
          }
        );
      }
    } else {
      console.error('Company identifier not found.');
    }
  }
  }




