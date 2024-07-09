import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { ApexOptions } from 'ng-apexcharts';

enum TaskState {
  ON_HOLD = 'ON_HOLD',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

@Component({
  selector: 'app-user-homepage',
  templateUrl: './user-homepage.component.html',
  styleUrls: ['./user-homepage.component.scss']
})
export class UserHomepageComponent implements OnInit {
  tasks: { state: TaskState }[];
  userTeams: any[] = [];

  chartOptions: ApexOptions;

  constructor(
    private authService: AuthenticationService,
    private taskService: TaskService,
    private userService: UserService
  ) {
    this.chartOptions = {
      chart: {
        type: 'bar',
        height: 250
      },
      series: [],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      xaxis: {
        categories: Object.values(TaskState),
      },
      yaxis: {
        title: {
          text: 'Number of Tasks'
        }
      },
      colors: ['#86B6F6', '#A1EEBD', '#facc15', '#FA7070']
    };
  }
  taskColors = {
    [TaskState.ON_HOLD]: '#facc15',
    [TaskState.IN_PROGRESS]: '#86B6F6',
    [TaskState.COMPLETED]: '#A1EEBD',
    [TaskState.CANCELED]: '#FA7070'
  };


  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.getTasksByUser(userId);
      this.loadUserTeams(userId);
    } else {
      console.error('User ID not found in local storage');
    }
  }

  getTasksByUser(userId: number): void {
    this.taskService.getTaskByUserId(userId).subscribe((tasks: any) => {
      this.tasks = tasks.filter((task:any) => !task.isDeleted);
      this.prepareChartData();
    });

  }
  get activeTasksCount(): number {
    return this.tasks.length;
  }
  loadUserTeams(userId: number): void {
    this.userService.getUserDetails(userId).subscribe((user: any) => {
      this.userTeams = user.teams.filter((team: any) => !team.isDeleted);
      console.log("teams", this.userTeams);
    });
  }
  get activeUserTeamsCount(): number {
    return this.userTeams?.filter((team: any) => !team.isDeleted).length || 0;
  }

  prepareChartData(): void {
    const taskCounts = {
      [TaskState.ON_HOLD]: 0,
      [TaskState.IN_PROGRESS]: 0,
      [TaskState.COMPLETED]: 0,
      [TaskState.CANCELED]: 0
    };

    this.tasks.forEach(task => {
      taskCounts[task.state]++;
    });

    const series = Object.keys(taskCounts).map(state => ({
      name: state,
      data: [taskCounts[state as TaskState]],
      color: this.taskColors[state as TaskState] || '#000000'
    }));

    this.chartOptions.series = series;
  }


}
