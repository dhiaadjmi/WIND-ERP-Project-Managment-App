import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTeamDialogComponent } from '../update-team-dialog/update-team-dialog.component';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-teams',
  templateUrl: './user-teams.component.html',
  styleUrls: ['./user-teams.component.scss'],

})
export class UserTeamsComponent implements OnInit {
  userId: any;
  user: any;
  teams: any[] = [];
  currentPage: string;



  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private teamService: TeamService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.loadUserTeams();
    } else {
      console.error('User ID not found in local storage');
    }
  }

  loadUserTeams(): void {
    this.userService.getUserDetails(this.userId).subscribe(user => {
      this.user = user;
      this.user.teams.forEach((team: { id: number }) => {
        this.teamService.findTeamById(team.id).subscribe(teamDetails => {
          const updatedUsers = teamDetails.users.map((user: any) => {
            return {
              ...user,
              profileImageUrl: 'http://localhost:8060/images/' + user.profileImageUrl
            };
          });
          const updatedTeam = {
            ...teamDetails,
            users: updatedUsers
          };
          this.teams.push(updatedTeam);
          console.log('Détails de l\'équipe :', updatedTeam);
        });
      });
    });
  }
  isLeader(user: any): boolean {
    return user.role === 'LEADER';
  }




  showTeamProjects(teamId: number): void {
    this.router.navigate(['/component/teamprojects', teamId]);
  }



  openUserDetails(user: any): void {
    this.dialog.open(UserDetailsComponent, {
      width: '600px',
      position: { right: '290px' },
      data: user
    });
  }

}
