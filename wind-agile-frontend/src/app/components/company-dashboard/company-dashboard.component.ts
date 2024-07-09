import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProjectService } from 'src/app/services/project.service';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss']
})
export class CompanyDashboardComponent {
  activeTeamsCount: number = 0;

  userChart: any = {
    series: [],
    chart: {
      width: 380,
      height: 250,
      type: "donut"
    },
    labels: ['Employees','Leaders'],
    colors: ['#facc15', '#00095E'],
    fill: {
      type: "gradient"
    },
    legend: {
      formatter: function(val: any, opts: any) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
      }

    },
    dataLabels: {
      enabled: false
    }
  };



  projectChart: any = {
    series: [],
    chart: {
      type: 'pie',
      height: 250

      },
    colors: ['#86B6F6', '#A1EEBD', '#facc15', '#FA7070']
  };
  completionPercentage: number = 0;
  totalUsersCount: number = 0;
  projects: any[] = [];
  teamChartOptions: any;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private teamService: TeamService,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    const companyIdentifier = this.authService.getUserId();
    console.log("id",companyIdentifier)
    this.fetchUsersByCompany();
    this.loadUserTeams(companyIdentifier);
        this.getAllProjects();


  }

  fetchUsersByCompany(): void {
    const companyIdentifier = this.authService.getUserId();
    if (companyIdentifier) {
      this.userService.getAllUsersByCompany(companyIdentifier).subscribe(
        (users: any[]) => {
          let leaderCount = 0;
          let employeeCount = 0;
          users.forEach(user => {
            if (user.role === 'LEADER') {
              leaderCount++;
            } else if (user.role === 'EMPLOYEE') {
              employeeCount++;
            }
          });

          this.totalUsersCount = leaderCount + employeeCount;

          this.userChart.series = [employeeCount, leaderCount];
        },
        error => {
          console.error('Error fetching users:', error);
        }
      );
    } else {
      console.error('Company identifier not found.');
    }
  }


  loadUserTeams(companyIdentifier: any): void {
    this.teamService.findAllTeamsByCompany(companyIdentifier).subscribe(
      (teams: any[]) => {
        const activeTeams = teams.filter(team => !team.isDeleted);
        this.activeTeamsCount = activeTeams.length;

        const teamNames = activeTeams.map(team => team.name);
        console.log('Les noms des équipes:', teamNames);

        const membersCount = activeTeams.map(team => team.users.length);

        this.teamChartOptions = {
          series: [{ data: membersCount }],
          chart: {
            type: 'bar',
            height: 200
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: teamNames
          },
          colors: ['#facc15']
        };
      },
      (error) => {
        console.error('Erreur lors de la récupération des équipes:', error);
      }
    );
  }












  getAllProjects(): void {
    const companyIdentifier = this.authService.getUserId();
    this.projectService.getAllProjects(companyIdentifier).subscribe(projects => {
      console.log('Projects:', projects);
      this.projects = projects;

      let inProgressCount = 0;
      let completedCount = 0;
      let onHoldCount = 0;
      let canceledCount = 0;

      projects.forEach(project => {
        switch (project.state) {
          case 'IN_PROGRESS':
            inProgressCount++;
            break;
          case 'COMPLETED':
            completedCount++;
            break;
          case 'ON_HOLD':
            onHoldCount++;
            break;
          case 'CANCELED':
            canceledCount++;
            break;
          default:
            break;
        }
      });

      this.projectChart.series = [
        inProgressCount,
        completedCount,
        onHoldCount,
        canceledCount
      ];

      const totalProjects = this.getTotalProjectsCount();
      const completionPercentage = (completedCount / totalProjects) * 100;
      this.completionPercentage = isNaN(completionPercentage) ? 0 : completionPercentage;
    });
  }




  getTotalProjectsCount(): number {
    return this.projects.length;
  }

  getCompletionPercentage(): number {
    return this.completionPercentage;
  }




}
