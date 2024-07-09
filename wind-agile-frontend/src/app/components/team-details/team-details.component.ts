import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { AuthenticationService } from '../../services/authentication.service';
import Swal from 'sweetalert2';

import { Observable, forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddUserToTeamDialogComponentComponent } from '../add-user-to-team-dialog-component/add-user-to-team-dialog-component.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss']
})
export class TeamDetailsComponent implements OnInit {
  teamMembers: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;


  teamId: number | undefined;
  team: any;

  constructor(private route: ActivatedRoute,
     private teamService: TeamService ,
     private authService: AuthenticationService,
     private dialog: MatDialog,
     private toastr: ToastrService) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.teamId = Number(params.get('id'));


      this.teamService.findTeamById(this.teamId).subscribe(
        (teamDetails) => {
          this.team = teamDetails;
          console.log(this.team)
          if (this.team) {
            this.loadTeamMembersProfileImages(this.team.users);
          }
        },
        (error) => {
          console.error('Error fetching team details:', error);
        }
      );
    });
    this.teamMembers.paginator = this.paginator;

  }

  loadTeamMembersProfileImages(users: any[]): void {
    const observables: Observable<string>[] = [];

    users.forEach((user: any) => {
      observables.push(this.authService.getProfileImageUrl(user.id));
    });

    forkJoin(observables).subscribe(
      (imageUrls: string[]) => {
        this.teamMembers.data = users.map((user: any, index: number) => ({
          ...user,
          profileImageUrl: imageUrls[index]
        }));

        this.teamMembers.paginator = this.paginator;
      },
      (error) => {
        console.error('Error fetching profile images:', error);
      }
    );
  }

  removeUserFromTeam(teamId: number, userId: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir retirer cet utilisateur de l\'équipe ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, retirer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#00095E',
      cancelButtonColor: '#facc15'
    }).then((result) => {
      if (result.isConfirmed) {
        this.teamService.removeUserFromTeam(teamId, userId).subscribe(
          () => {
            this.toastr.success('L\'utilisateur a été retiré de l\'équipe avec succès.', 'Retiré !');
            this.loadTeamDetails(teamId);
          },
          (error) => {
            console.error('Erreur lors de la suppression de l\'utilisateur de l\'équipe:', error);
            this.toastr.error('Une erreur est survenue lors de la suppression de l\'utilisateur de l\'équipe.', 'Erreur');
          }
        );
      }
    });
  }

  loadTeamDetails(teamId: number): void {
    this.teamService.findTeamById(teamId).subscribe(
      (teamDetails) => {
        this.team = teamDetails;
        if (this.team) {
          this.loadTeamMembersProfileImages(this.team.users);
        }
      },
      (error) => {
        console.error('Error fetching team details:', error);
      }
    );
  }


/**

  openAddUserToTeamDialog(teamId: number): void {
    const dialogRef = this.dialog.open(AddUserToTeamDialogComponentComponent, {
      width: '600px',
      data: { teamId: teamId }

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialogue fermé avec le résultat:', result);
    });
  }
  */
  openAddUserToTeamDialog(teamId: number): void {
    const dialogRef = this.dialog.open(AddUserToTeamDialogComponentComponent, {
      width: '600px',
      data: { teamId: teamId }
    });

    dialogRef.componentInstance.userAdded.subscribe(() => {
      this.loadTeamDetails(teamId);
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialogue fermé avec le résultat:', result);
    });
  }


}
