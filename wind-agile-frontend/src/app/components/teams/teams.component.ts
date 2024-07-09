import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTeamDialogComponent } from '../update-team-dialog/update-team-dialog.component';
import Swal from 'sweetalert2';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  teams: any[] = [];
  companyIdentifier: number;
  currentPage: string;


  constructor(private router: Router,
     private teamService: TeamService,
      private authService: AuthenticationService,
      private dialog: MatDialog,
      private toastr: ToastrService) {}

  ngOnInit(): void {
   this.companyIdentifier = this.authService.getUserId();
    this.loadTeams();
  }

  loadTeams(): void {
    console.log('Company Identifier:', this.companyIdentifier);

    this.teamService.findAllTeamsByCompany(this.companyIdentifier).subscribe(
      (teams) => {
        this.teams = teams.map((team: any) => {
          const updatedUsers = team.users.map((user: any) => {
            return {
              ...user,
              profileImageUrl: 'http://localhost:8060/images/' + user.profileImageUrl
            };
          });
          return { ...team, users: updatedUsers };
        });
      },
      (error) => {
        console.error('Error fetching teams:', error);
      }
    );
  }


  isLeader(user: any): boolean {
    return user.role === 'LEADER';
  }


  showMembers(team: any): void {
    this.router.navigate(['/component/teamdetails', team.id]);
  }

  openUpdateTeamDialog(teamId: number): void {
    const dialogRef = this.dialog.open(UpdateTeamDialogComponent, {
      width: '600px',
      data: { teamId: teamId },
    //  position: { right: '290px' }
    });
    dialogRef.componentInstance.teamUpdated.subscribe(() => {
      this.loadTeams();
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialogue fermé avec le résultat:', result);
    });
  }

  onAddTeamClick(): void {
    this.router.navigate(['component/addteam']);
  }
  onSoftDeleteTeam(teamId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Voulez-vous vraiment supprimer cette équipe?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00095E',
      cancelButtonColor: '#facc15',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.teamService.softDeleteTeam(teamId).subscribe(
          () => {
            this.toastr.success('L\'équipe a été supprimée.', 'Supprimé!');
            this.loadTeams();
          },
          (error) => {
            console.error('Erreur lors de la suppression de l\'équipe :', error);
            this.toastr.error('Une erreur est survenue lors de la suppression de l\'équipe.', 'Erreur!');
          }
        );
      }
    });
  }

  openUserDetails(user: any): void {
    this.dialog.open(UserDetailsComponent, {
      width: '600px',
    //  position: { right: '290px' },
      data: user
    });
  }
  navigateTo(page: string): void {
    this.currentPage = page;
  }
}
